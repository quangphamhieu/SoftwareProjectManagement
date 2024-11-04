using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using WebApplication1.DbContexts; // Đảm bảo bạn có namespace này
using WebApplication1.DTO.Create;
using WebApplication1.Entity;
using WebApplication1.Service.Abstracts;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequestController(IRequestService requestService, IHttpContextAccessor httpContextAccessor)
        {
            _requestService = requestService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        [Authorize(Roles = "Employee")]
        public IActionResult CreateRequest([FromBody] RequestCreateDto requestCreateDto)
        {
            var employeeIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("Id");
            var employeeId = employeeIdClaim != null ? Int32.Parse(employeeIdClaim.Value) : 0;

            try
            {
                var request = _requestService.CreateRequest(requestCreateDto, employeeId);
                return CreatedAtAction(nameof(FindRequestById), new { id = request.Id }, request);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult FindRequestById(int id)
        {
            var request = _requestService.FindRequestById(id);
            if (request == null)
                return NotFound("Request not found.");

            return Ok(request);
        }

        [HttpGet("my-request")]
        [Authorize]
        public IActionResult FindMyRequest()
        {
            var employeeIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("Id");
            var employeeId = employeeIdClaim != null ? Int32.Parse(employeeIdClaim.Value) : 0;

            var requests = _requestService.GetRequestsByEmployeeId(employeeId);
            return Ok(requests);
        }

        [HttpGet("my-pending-requests")]
        [Authorize(Roles = "DepartmentHead")]
        public IActionResult GetPendingRequestsByDepartmentHeadId()
        {
            // Retrieve DepartmentHeadId from claims
            var departmentHeadIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("Id");
            var departmentHeadId = departmentHeadIdClaim != null ? Int32.Parse(departmentHeadIdClaim.Value) : 0;

            // Fetch pending requests for the department head
            var requests = _requestService.GetPendingRequestsByDepartmentHeadId(departmentHeadId);
            return Ok(requests);
        }

        [HttpGet("all-my-requests")]
        [Authorize(Roles = "DepartmentHead")]
        public IActionResult GetAllRequestsByDepartmentHeadId()
        {
            // Retrieve DepartmentHeadId from claims
            var departmentHeadIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("Id");
            var departmentHeadId = departmentHeadIdClaim != null ? Int32.Parse(departmentHeadIdClaim.Value) : 0;

            // Fetch all requests for the department head's employees
            var requests = _requestService.GetAllRequestsByDepartmentHeadId(departmentHeadId);
            return Ok(requests);
        }



        [HttpGet("assetManagement")]
        [Authorize(Roles = "AssetManager")]
        public IActionResult GetApprovedRequestsForAssetManagement()
        {
            var requests = _requestService.GetApprovedRequestsForAssetManagement();
            return Ok(requests);
        }

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
