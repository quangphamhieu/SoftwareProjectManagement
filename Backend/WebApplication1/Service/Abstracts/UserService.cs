using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.DTO.Find;
using WebApplication1.Entity;
using WebApplication1.DbContexts;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Update;
using WebApplication1.Service.Abstracts;

namespace WebApplication1.Service.Implements
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor; // Khởi tạo _httpContextAccessor
        }

        public void CreateUser(UserCreateDto userCreateDto)
        {
            var user = new User
            {
                Email = userCreateDto.Email,
                Password = userCreateDto.Password,
                FullName = userCreateDto.FullName,
                DepartmentHeadId = userCreateDto.DepartmentHeadId
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var userRole = new UserRole
            {
                UserId = user.Id,
                RoleId = userCreateDto.RoleId
            };

            _context.UserRoles.Add(userRole);
            _context.SaveChanges();
        }

        public UserFindDto FindUserById()
        {
            // Lấy ID của người dùng từ claims
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("Id");
            var userId = userIdClaim != null ? Int32.Parse(userIdClaim.Value) : 0;

            var user = _context.Users
                .Where(u => u.Id == userId) // Lọc người dùng theo ID đã lấy từ claims
                .Select(u => new UserFindDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    Password = u.Password,
                    DepartmentHeadId = u.DepartmentHeadId,
                    DepartmentHeadName = u.DepartmentHead != null ? u.DepartmentHead.FullName : string.Empty,
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => r.Name)
                        .FirstOrDefault()
                })
                .FirstOrDefault();

            return user; // Trả về thông tin người dùng
        }


        public IEnumerable<UserFindDto> GetAllUsers()
        {
            return _context.Users
                .Select(user => new UserFindDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Password = user.Password,
                    DepartmentHeadId = user.DepartmentHeadId,
                    DepartmentHeadName = user.DepartmentHead != null ? user.DepartmentHead.FullName : string.Empty,
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == user.Id)
                        .Join(_context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => r.Name)
                        .FirstOrDefault()
                })
                .ToList();
        }

        public IEnumerable<UserFindDto> FindUsersByFullName(string fullName)
        {
            return _context.Users
                .Where(u => u.FullName.Contains(fullName))
                .Select(u => new UserFindDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    Password = u.Password,
                    DepartmentHeadId = u.DepartmentHeadId,
                    DepartmentHeadName = u.DepartmentHead != null ? u.DepartmentHead.FullName : string.Empty,
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => r.Name)
                        .FirstOrDefault()
                })
                .ToList();
        }

        public IEnumerable<UserFindDto> FindUsersByDepartmentHeadName(string departmentHeadName)
        {
            return _context.Users
                .Where(u => u.DepartmentHead != null && u.DepartmentHead.FullName.Contains(departmentHeadName))
                .Select(u => new UserFindDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    DepartmentHeadId = u.DepartmentHeadId,
                    DepartmentHeadName = u.DepartmentHead != null ? u.DepartmentHead.FullName : string.Empty,
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => r.Name)
                        .FirstOrDefault()
                })
                .ToList();
        }

        public void UpdateUser(int userId, UserUpdateDto userUpdateDto)
        {
            var user = _context.Users.Find(userId);
            if (user == null) throw new Exception("User not found");

            user.Email = userUpdateDto.Email;
            user.FullName = userUpdateDto.FullName;
            user.Password = userUpdateDto.Password;
            user.DepartmentHeadId = userUpdateDto.DepartmentHeadId;

            _context.SaveChanges();
        }

        public void DeleteUser(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null) throw new Exception("User not found");

            _context.Users.Remove(user);
            _context.SaveChanges();
        }
        public UserFindDto FindUserById(int id)
        {
            var user = _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserFindDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    DepartmentHeadId = u.DepartmentHeadId,
                    DepartmentHeadName = u.DepartmentHead != null ? u.DepartmentHead.FullName : string.Empty,
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_context.Roles,
                              ur => ur.RoleId,
                              r => r.Id,
                              (ur, r) => r.Name)
                        .FirstOrDefault()
                })
                .FirstOrDefault();

            return user ?? throw new Exception("User not found");
        }

    }
}