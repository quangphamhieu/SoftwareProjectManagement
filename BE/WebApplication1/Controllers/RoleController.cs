using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Update;
using WebApplication1.Service.Abstracts;
using WebApplication1.Service.Implements;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Chỉ cho phép người dùng có vai trò Admin
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // Tạo một vai trò mới
        [HttpPost]
        public IActionResult CreateRole([FromBody] RoleCreateDto roleCreateDto)
        {
            _roleService.CreateRole(roleCreateDto);
            return CreatedAtAction(nameof(FindRoleById), new { id = roleCreateDto.Name }, roleCreateDto); // Cập nhật dòng này
        }

        // Lấy thông tin vai trò theo ID
        [HttpGet("{id}")]
        public ActionResult<RoleFindDto> FindRoleById(int id)
        {
            var role = _roleService.FindRoleById(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        // Lấy danh sách tất cả vai trò
        [HttpGet]
        public ActionResult<IEnumerable<RoleFindDto>> GetAllRoles()
        {
            var roles = _roleService.GetAllRoles();
            return Ok(roles);
        }

        // Cập nhật thông tin vai trò
        [HttpPut("{id}")]
        public IActionResult UpdateRole(int id, [FromBody] RoleUpdateDto roleUpdateDto)
        {
            _roleService.UpdateRole(id, roleUpdateDto);
            return NoContent();
        }

        // Xóa vai trò theo ID
        [HttpDelete("{id}")]
        public IActionResult DeleteRole(int id)
        {
            _roleService.DeleteRole(id);
            return NoContent();
        }
    }
}
