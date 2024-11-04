using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Update;

namespace WebApplication1.Service.Abstracts
{
    public interface IUserService
    {
        void CreateUser(UserCreateDto userCreateDto);
        UserFindDto FindUserById(); // Cập nhật để không có tham số
        IEnumerable<UserFindDto> GetAllUsers();
        void UpdateUser(int userId, UserUpdateDto userUpdateDto);
        void DeleteUser(int userId);
        IEnumerable<UserFindDto> FindUsersByFullName(string fullName);
        IEnumerable<UserFindDto> FindUsersByDepartmentHeadName(string departmentHeadName);
    }

}
