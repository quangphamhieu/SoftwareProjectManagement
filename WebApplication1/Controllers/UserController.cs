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
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateUser([FromBody] UserCreateDto userCreateDto)
        {
            _userService.CreateUser(userCreateDto);
            return CreatedAtAction(nameof(GetAllUsers), new { }, userCreateDto);
        }

        // GET: api/user/{id}
        [HttpGet("userinfo")]
        public IActionResult FindUserById()
        {
            var user = _userService.FindUserById(); 
            if (user == null) return NotFound();
            return Ok(user);
        }


        // GET: api/user
        [HttpGet("get-all")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = _userService.GetAllUsers();
            return Ok(users);
        }

        // PUT: api/user/{id}
        [HttpPut("update")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
        {
            _userService.UpdateUser(id, userUpdateDto);
            return NoContent();
        }

        // DELETE: api/user/{id}
        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(int id)
        {
            _userService.DeleteUser(id);
            return NoContent();
        }

        // GET: api/user/search/by-fullname?fullName={fullName}
        [HttpGet("search/by-fullname")]
        [Authorize(Roles = "Admin, DepartmentHead")]
        public IActionResult FindUsersByFullName([FromQuery] string fullName)
        {
            var users = _userService.FindUsersByFullName(fullName);
            return Ok(users);
        }

        // GET: api/user/search/by-department-head?departmentHeadName={departmentHeadName}
        [HttpGet("search/by-department-head")]
        [Authorize(Roles = "Admin")]
        public IActionResult FindUsersByDepartmentHeadName([FromQuery] string departmentHeadName)
        {
            var users = _userService.FindUsersByDepartmentHeadName(departmentHeadName);
            return Ok(users);
        }
    }
}
