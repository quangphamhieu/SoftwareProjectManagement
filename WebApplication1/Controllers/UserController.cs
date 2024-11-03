using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Update;
using WebApplication1.Service.Abstracts;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/user
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateUser([FromBody] UserCreateDto userCreateDto)
        {
            _userService.CreateUser(userCreateDto);
            return CreatedAtAction(nameof(GetAllUsers), new { }, userCreateDto); // Sửa ở đây, không cần id
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ cho phép Admin và Trưởng bộ phận truy cập
        public IActionResult FindUserById(int id)
        {
            var user = _userService.FindUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // GET: api/user
        [HttpGet]
        [Authorize(Roles = "Admin")] // Tất cả các vai trò này đều có thể xem danh sách người dùng
        public IActionResult GetAllUsers()
        {
            var users = _userService.GetAllUsers();
            return Ok(users);
        }

        // PUT: api/user/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ cho phép Admin cập nhật người dùng
        public IActionResult UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            _userService.UpdateUser(id, userUpdateDto);
            return NoContent();
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ cho phép Admin xóa người dùng
        public IActionResult DeleteUser(int id)
        {
            _userService.DeleteUser(id);
            return NoContent();
        }
    }
}
