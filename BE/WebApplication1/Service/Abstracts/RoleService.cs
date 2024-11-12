using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DbContexts;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Update;
using WebApplication1.Entity;
using WebApplication1.Service.Implements;

namespace WebApplication1.Service.Abstracts
{
    public class RoleService : IRoleService
    {
        private readonly ApplicationDbContext _context;

        public RoleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void CreateRole(RoleCreateDto roleCreateDto)
        {
            var role = new Role
            {
                Name = roleCreateDto.Name
            };

            _context.Roles.Add(role);
            _context.SaveChanges();
        }

        public RoleFindDto FindRoleById(int roleId)
        {
            var role = _context.Roles.Find(roleId);
            if (role == null)
            {
                throw new KeyNotFoundException("Role not found");
            }

            return new RoleFindDto
            {
                Id = role.Id,
                Name = role.Name
            };
        }

        public IEnumerable<RoleFindDto> GetAllRoles()
        {
            return _context.Roles.Select(r => new RoleFindDto
            {
                Id = r.Id,
                Name = r.Name
            }).ToList();
        }

        public void UpdateRole(int roleId, RoleUpdateDto roleUpdateDto)
        {
            var role = _context.Roles.Find(roleId);
            if (role == null)
            {
                throw new KeyNotFoundException("Role not found");
            }

            role.Name = roleUpdateDto.Name;

            _context.Roles.Update(role);
            _context.SaveChanges();
        }

        public void DeleteRole(int roleId)
        {
            var role = _context.Roles.Find(roleId);
            if (role == null)
            {
                throw new KeyNotFoundException("Role not found");
            }

            _context.Roles.Remove(role);
            _context.SaveChanges();
        }
    }
}
