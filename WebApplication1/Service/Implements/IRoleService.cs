using System.Collections.Generic;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Update;

namespace WebApplication1.Service.Implements
{
    public interface IRoleService
    {
        void CreateRole(RoleCreateDto roleCreateDto);
        RoleFindDto FindRoleById(int roleId);
        IEnumerable<RoleFindDto> GetAllRoles();
        void UpdateRole(int roleId, RoleUpdateDto roleUpdateDto);
        void DeleteRole(int roleId);
    }
}
