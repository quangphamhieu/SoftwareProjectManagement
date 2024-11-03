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

        public void CreateRequest(RequestCreateDto requestDto)
        {
            var request = new Request
            {
                EmployeeId = requestDto.EmployeeId,
                StatusId = 1, // Trạng thái 'chờ duyệt'
                CreatedDate = DateTime.UtcNow,
                RequestItems = requestDto.RequestItems.Select(item => new RequestItem
                {
                    AssetId = item.AssetId,
                    Quantity = item.Quantity
                }).ToList()
            };

            _context.Requests.Add(request);
            _context.SaveChanges();
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
                StatusName = request.Status?.Name ?? "Unknown",
                CreatedDate = request.CreatedDate,
                RequestItems = request.RequestItems.Select(ri => new RequestItemDto
                {
                    AssetId = ri.AssetId,
                    Quantity = ri.Quantity
                }).ToList()
            };
        }

        // Danh sách đơn của nhân viên
        public IEnumerable<RequestFindDto> GetRequestsByEmployeeId(int employeeId)
        {
            return _context.Requests
                .Where(r => r.EmployeeId == employeeId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    StatusName = r.Status.Name,
                    CreatedDate = r.CreatedDate,
                    RequestItems = r.RequestItems.Select(ri => new RequestItemDto
                    {
                        AssetId = ri.AssetId,
                        Quantity = ri.Quantity
                    }).ToList()
                }).ToList();
        }

        // Danh sách đơn chờ duyệt của nhân viên thuộc quản lý của trưởng bộ phận
        public IEnumerable<RequestFindDto> GetPendingRequestsByDepartmentHeadId(int departmentHeadId)
        {
            return _context.Requests
                .Include(r => r.Employee)
                .Where(r => r.StatusId == 1 && r.Employee.DepartmentHeadId == departmentHeadId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    StatusName = r.Status.Name,
                    CreatedDate = r.CreatedDate,
                    RequestItems = r.RequestItems.Select(ri => new RequestItemDto
                    {
                        AssetId = ri.AssetId,
                        Quantity = ri.Quantity
                    }).ToList()
                }).ToList();
        }

        // Danh sách đơn được phê duyệt bởi trưởng bộ phận dành cho bộ phận quản lý tài sản
        public IEnumerable<RequestFindDto> GetApprovedRequestsForAssetManagement()
        {
            return _context.Requests
                .Where(r => r.StatusId == 2)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
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

            request.StatusId = 2; // 'trưởng bộ phận duyệt'
            _context.SaveChanges();
        }

        public void RejectRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.Id == id);
            if (request == null)
                throw new Exception("Request not found");

            request.StatusId = 3; // 'từ chối'
            _context.SaveChanges();
        }

        public void DeleteRequest(int id)
        {
            var request = _context.Requests.FirstOrDefault(r => r.Id == id);
            if (request == null)
                throw new Exception("Request not found");

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

            request.StatusId = 4; // 'được phê duyệt bởi bộ phận quản lý tài sản'
            _context.SaveChanges();
        }
    }
}
