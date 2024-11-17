using Microsoft.AspNetCore.Mvc;
using System;
using WebApplication1.DTO.Create;
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

        [HttpPost]
        public IActionResult CreateRequest([FromBody] RequestCreateDto requestCreateDto)
        {
            try
            {
                var request = _requestService.CreateRequest(requestCreateDto, requestCreateDto.EmployeeId);
                return CreatedAtAction(nameof(FindRequestById), new { id = request.Id }, request);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult FindRequestById(int id)
        {
            var request = _requestService.FindRequestById(id);
            if (request == null)
                return NotFound("Request not found.");

            return Ok(request);
        }

        [HttpGet("employee-requests/{employeeId}")]
        public IActionResult GetRequestsByEmployeeId(int employeeId)
        {
            var requests = _requestService.GetRequestsByEmployeeId(employeeId);
            return Ok(requests);
        }

        [HttpGet("pending-requests/{departmentHeadId}")]
        public IActionResult GetPendingRequestsByDepartmentHeadId(int departmentHeadId)
        {
            var requests = _requestService.GetPendingRequestsByDepartmentHeadId(departmentHeadId);
            return Ok(requests);
        }

        [HttpGet("approved-requests")]
        public IActionResult GetApprovedRequestsForAssetManagement()
        {
            var requests = _requestService.GetApprovedRequestsForAssetManagement();
            return Ok(requests);
        }

        [HttpPut("approve/{id}")]
        public IActionResult ApproveRequest(int id)
        {
            try
            {
                _requestService.ApproveRequest(id);
                return Ok("Request approved by department head.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("reject/{id}")]
        public IActionResult RejectRequest(int id)
        {
            try
            {
                _requestService.RejectRequest(id);
                return Ok("Request rejected.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRequest(int id)
        {
            try
            {
                _requestService.DeleteRequest(id);
                return Ok("Request deleted.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("assetManagement/approve/{id}")]
        public IActionResult ApproveAssetRequest(int id)
        {
            try
            {
                _requestService.ApproveAssetRequest(id);
                return Ok("Request approved by asset management.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
