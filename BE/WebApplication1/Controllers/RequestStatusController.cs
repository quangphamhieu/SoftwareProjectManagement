using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Create;
using WebApplication1.Service.Abstracts;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")] // Chỉ cho phép người dùng có vai trò Admin
    public class RequestStatusController : ControllerBase
    {
        private readonly IRequestStatusService _requestStatusService;

        public RequestStatusController(IRequestStatusService requestStatusService)
        {
            _requestStatusService = requestStatusService;
        }

        // GET: api/requeststatus
        [HttpGet]
        public ActionResult<IEnumerable<RequestStatusFindDto>> GetAllRequestStatuses()
        {
            var statuses = _requestStatusService.GetAllRequestStatuses();
            return Ok(statuses);
        }

        // POST: api/requeststatus
        [HttpPost]
        public ActionResult CreateRequestStatus([FromBody] RequestStatusCreateDto requestStatusDto)
        {
            try
            {
                // Gọi dịch vụ để tạo trạng thái yêu cầu
                _requestStatusService.CreateRequestStatus(requestStatusDto);

                // Trả về mã trạng thái 201 Created mà không cần ID
                return CreatedAtAction(nameof(GetAllRequestStatuses), null, requestStatusDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/requeststatus/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteRequestStatus(int id)
        {
            try
            {
                _requestStatusService.DeleteRequestStatus(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
