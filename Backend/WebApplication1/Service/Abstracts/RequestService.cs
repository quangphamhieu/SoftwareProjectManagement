using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DbContexts;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Request;
using WebApplication1.Entity;

namespace WebApplication1.Service.Abstracts
{
    public class RequestService : IRequestService
    {
        private readonly ApplicationDbContext _context;

        public RequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Request CreateRequest(RequestCreateDto requestCreateDto, int employeeId)
        {
            if (employeeId <= 0)
            {
                throw new ArgumentException("Employee ID không hợp lệ.");
            }

            var employee = _context.Users.FirstOrDefault(e => e.Id == employeeId);
            if (employee == null)
            {
                throw new ArgumentException("Không tìm thấy nhân viên với ID đã cung cấp.");
            }

            var request = new Request
            {
                EmployeeId = employeeId,
                EmployeeName = employee.FullName,
                EmployeeEmail = employee.Email,
                StatusId = 1,
                CreatedDate = DateTime.Now,
                RequestItems = requestCreateDto.RequestItems.Select(item => new RequestItem
                {
                    AssetId = item.AssetId,
                    Quantity = item.Quantity
                }).ToList()
            };

            _context.Requests.Add(request);
            _context.SaveChanges();
            return request;
        }

        public RequestFindDto FindRequestById(int id)
        {
            var request = _context.Requests
                .Include(r => r.RequestItems)
                .ThenInclude(ri => ri.Asset)
                .FirstOrDefault(r => r.Id == id);

            if (request == null)
                throw new Exception("Request not found");

            return new RequestFindDto
            {
                Id = request.Id,
                EmployeeId = request.EmployeeId,
                StatusName = request.Status.Name,
                CreatedDate = request.CreatedDate,
                RequestItems = request.RequestItems.Select(ri => new RequestItemDto
                {
                    AssetId = ri.AssetId,
                    Quantity = ri.Quantity
                }).ToList()
            };
        }

        public IEnumerable<RequestFindDto> GetRequestsByEmployeeId(int employeeId)
        {
            return _context.Requests
                .Where(r => r.EmployeeId == employeeId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName,
                    EmployeeEmail = r.Employee.Email,
                    StatusName = r.Status.Name,
                    CreatedDate = r.CreatedDate,
                    RequestItems = r.RequestItems.Select(ri => new RequestItemDto
                    {
                        AssetId = ri.AssetId,
                        AssetName = ri.Asset.Name,
                        Quantity = ri.Quantity
                    }).ToList()
                })
                .ToList();
        }


        public IEnumerable<RequestFindDto> GetPendingRequestsByDepartmentHeadId(int departmentHeadId)
        {
            return _context.Requests
                .Where(r => r.StatusId == 1 && r.Employee.DepartmentHeadId == departmentHeadId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName,
                    EmployeeEmail = r.Employee.Email,
                    DepartmentHeadId = r.Employee.DepartmentHeadId,
                    DepartmentHeadName = r.Employee.DepartmentHead.FullName,
                    StatusName = r.Status.Name,
                    CreatedDate = r.CreatedDate,
                    RequestItems = r.RequestItems.Select(ri => new RequestItemDto
                    {
                        AssetId = ri.AssetId,
                        Quantity = ri.Quantity
                    }).ToList()
                }).ToList();
        }


        public IEnumerable<RequestFindDto> GetApprovedRequestsForAssetManagement()
        {
            return _context.Requests
                .Where(r => r.StatusId == 2)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName,
                    EmployeeEmail = r.Employee.Email,
                    StatusName = r.Status.Name,
                    CreatedDate = r.CreatedDate,
                    RequestItems = r.RequestItems.Select(ri => new RequestItemDto
                    {
                        AssetId = ri.AssetId,
                        Quantity = ri.Quantity
                    }).ToList()
                }).ToList();
        }

        public void ApproveRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.Id == id);
            if (request == null)
                throw new Exception("Request not found");

            request.StatusId = 2;
            _context.SaveChanges();
        }

        public void RejectRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.Id == id);
            if (request == null)
                throw new Exception("Request not found");

            request.StatusId = 3;
            _context.SaveChanges();
        }

        public void DeleteRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.Id == id);

            if (request == null)
                throw new Exception("Request not found.");

            if (request.StatusId != 1)
                throw new Exception("Only requests with a status of '1' can be deleted.");

            _context.Requests.Remove(request);
            _context.SaveChanges();
        }


        public void ApproveAssetRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.Id == id);
            if (request == null)
                throw new Exception("Request not found");

            if (request.StatusId != 2)
                throw new Exception("Request must be approved by the department head before asset management can approve it.");

            request.StatusId = 4;
            _context.SaveChanges();
        }
    }
}
