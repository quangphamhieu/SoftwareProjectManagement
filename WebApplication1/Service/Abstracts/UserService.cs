using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.DTO.Find;
using WebApplication1.Entity;
using WebApplication1.DbContexts;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Update;
using WebApplication1.Service.Implements;
using WebApplication1.DTO.Delete;

namespace WebApplication1.Service.Abstracts
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
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
                RoleId = userCreateDto.RoleId // Giả sử bạn truyền RoleId trong DTO
            };
            // Thêm userRole vào context và lưu thay đổi
            _context.UserRoles.Add(userRole);
            _context.SaveChanges(); // Lưu thay đổi để cập nhật UserRole
        }

        public UserFindDto FindUserById(int userId)
        {
            var user = _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserFindDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    DepartmentHeadId = u.DepartmentHeadId,
                    // Truy vấn RoleName từ UserRole và Role qua Join
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == u.Id)
                        .Join(_context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => r.Name)
                        .FirstOrDefault() // Lấy tên vai trò đầu tiên (giả định người dùng chỉ có một vai trò)
                })
                .FirstOrDefault();

            return user;
        }


        public IEnumerable<UserFindDto> GetAllUsers()
        {
            return _context.Users
                .Select(user => new UserFindDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    DepartmentHeadId = user.DepartmentHeadId,
                    // Lấy RoleName từ UserRole và Role thông qua Join
                    RoleName = _context.UserRoles
                        .Where(ur => ur.UserId == user.Id)
                        .Join(_context.Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (ur, r) => r.Name)
                        .FirstOrDefault() // Lấy tên vai trò đầu tiên (giả định người dùng chỉ có một vai trò)
                })
                .ToList();
        }


        public void UpdateUser(int userId, UserUpdateDto userUpdateDto)
        {
            var user = _context.Users.Find(userId);
            if (user == null) throw new Exception("User not found");

            user.Email = userUpdateDto.Email;
            user.FullName = userUpdateDto.FullName;
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
    }
}
