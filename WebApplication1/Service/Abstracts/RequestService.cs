using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequestService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }
        public Request CreateRequest(RequestCreateDto requestCreateDto, int employeeId)
        {
            var employee = _context.Users.Include(u => u.DepartmentHead).FirstOrDefault(e => e.Id == employeeId);
            if (employee == null)
            {
                throw new ArgumentException("Employee not found.");
            }

            var status = _context.RequestStatuses.Find(1); // Lấy trạng thái mặc định từ Status table
            if (status == null)
            {
                throw new ArgumentException("Status not found.");
            }

            var request = new Request
            {
                EmployeeId = employeeId,
                EmployeeName = employee.FullName,
                EmployeeEmail = employee.Email,
                DepartmentHeadId = employee.DepartmentHeadId, // Gán DepartmentHeadId
                DepartmentHeadName = employee.DepartmentHead?.FullName ?? string.Empty, // Gán DepartmentHeadName
                StatusId = status.Id, // Lưu trạng thái ID
                CreatedDate = DateTime.UtcNow,
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

        // Danh sách đơn của nhân viên
        public IEnumerable<RequestFindDto> GetRequestsByEmployeeId(int employeeId)
        {
            return _context.Requests
                .Include(r => r.Employee) // Include Employee to get Employee's information
                .ThenInclude(e => e.DepartmentHead) // Include DepartmentHead to get the department head's information
                .Where(r => r.EmployeeId == employeeId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName, // Include Employee Name
                    EmployeeEmail = r.Employee.Email, // Include Employee Email
                    DepartmentHeadId = r.Employee.DepartmentHeadId, // Include Department Head ID
                    DepartmentHeadName = r.Employee.DepartmentHead.FullName, // Include Department Head Name
                    StatusName = r.Status.Name,
                    CreatedDate = r.CreatedDate,
                    RequestItems = r.RequestItems.Select(ri => new RequestItemDto
                    {
                        AssetId = ri.AssetId,
                        Quantity = ri.Quantity
                    }).ToList()
                }).ToList();
        }

        public IEnumerable<RequestFindDto> GetAllRequestsByDepartmentHeadId(int departmentHeadId)
        {
            return _context.Requests
                .Include(r => r.Employee) // Include Employee to access their information
                .ThenInclude(e => e.DepartmentHead) // Include DepartmentHead to access department head's info
                .Where(r => r.Employee.DepartmentHeadId == departmentHeadId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName,
                    EmployeeEmail = r.Employee.Email,
                    DepartmentHeadId = r.Employee.DepartmentHeadId,
                    DepartmentHeadName = r.Employee.DepartmentHead.FullName,
                    StatusName = r.Status.Name, // Include status name
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
                .Include(r => r.Employee) // Include Employee to access their information
                .ThenInclude(e => e.DepartmentHead) // Include DepartmentHead to access department head's info
                .Where(r => r.StatusId == 1 && r.Employee.DepartmentHeadId == departmentHeadId)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName, // Include Employee Name
                    EmployeeEmail = r.Employee.Email, // Include Employee Email
                    DepartmentHeadId = r.Employee.DepartmentHeadId, // Include Department Head ID
                    DepartmentHeadName = r.Employee.DepartmentHead.FullName, // Include Department Head Name
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
                .Include(r => r.Employee) // Include Employee for their details
                .ThenInclude(e => e.DepartmentHead) // Include DepartmentHead for their details
                .Where(r => r.StatusId == 2)
                .Select(r => new RequestFindDto
                {
                    Id = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.Employee.FullName, // Include Employee Name
                    EmployeeEmail = r.Employee.Email, // Include Employee Email
                    DepartmentHeadId = r.Employee.DepartmentHeadId, // Include Department Head ID
                    DepartmentHeadName = r.Employee.DepartmentHead.FullName, // Include Department Head Name
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
