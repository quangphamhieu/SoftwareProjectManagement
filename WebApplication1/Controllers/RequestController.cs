using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.Service.Abstracts;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public RequestController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        // Nhân viên: Tạo một đơn mới
        [HttpPost]
        [Authorize(Roles = "Employee")]
        public IActionResult CreateRequest([FromBody] RequestCreateDto requestDto)
        {
            _requestService.CreateRequest(requestDto);
            return Ok("Request created successfully.");
        }

        // Tìm đơn theo ID (Áp dụng cho tất cả)
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult FindRequestById(int id)
        {
            var request = _requestService.FindRequestById(id);
            if (request == null)
                return NotFound("Request not found.");

            return Ok(request);
        }

        // Nhân viên: Xem danh sách đơn của mình
        [HttpGet("employee/{employeeId}")]
        [Authorize(Roles = "Employee")]
        public IActionResult GetRequestsByEmployeeId(int employeeId)
        {
            var requests = _requestService.GetRequestsByEmployeeId(employeeId);
            return Ok(requests);
        }

        // Trưởng bộ phận: Xem danh sách đơn chờ duyệt của nhân viên mình quản lý
        [HttpGet("departmentHead/{departmentHeadId}")]
        [Authorize(Roles = "DepartmentHead")]
        public IActionResult GetPendingRequestsByDepartmentHeadId(int departmentHeadId)
        {
            var requests = _requestService.GetPendingRequestsByDepartmentHeadId(departmentHeadId);
            return Ok(requests);
        }

        // Bộ phận quản lý tài sản: Xem danh sách đơn đã được phê duyệt bởi trưởng bộ phận
        [HttpGet("assetManagement")]
        [Authorize(Roles = "AssetManager")]
        public IActionResult GetApprovedRequestsForAssetManagement()
        {
            var requests = _requestService.GetApprovedRequestsForAssetManagement();
            return Ok(requests);
        }

        // Trưởng bộ phận: Phê duyệt đơn
        [HttpPut("approve/{id}")]
        [Authorize(Roles = "DepartmentHead")]
        public IActionResult ApproveRequest(int id)
        {
            try
            {
                _requestService.ApproveRequest(id);
                return Ok("Request approved by department head.");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Trưởng bộ phận: Từ chối đơn
        [HttpPut("reject/{id}")]
        [Authorize(Roles = "DepartmentHead")]
        public IActionResult RejectRequest(int id)
        {
            try
            {
                _requestService.RejectRequest(id);
                return Ok("Request rejected.");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Nhân viên: Xóa đơn ở trạng thái 'chờ duyệt' hoặc 'từ chối'
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public IActionResult DeleteRequest(int id)
        {
            try
            {
                _requestService.DeleteRequest(id);
                return Ok("Request deleted.");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Bộ phận quản lý tài sản: Phê duyệt đơn sau khi trưởng bộ phận đã duyệt
        [HttpPut("assetManagement/approve/{id}")]
        [Authorize(Roles = "AssetManager")]
        public IActionResult ApproveAssetRequest(int id)
        {
            try
            {
                _requestService.ApproveAssetRequest(id);
                return Ok("Request approved by asset management.");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
