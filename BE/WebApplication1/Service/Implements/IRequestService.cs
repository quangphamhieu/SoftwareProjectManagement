using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.Entity;

namespace WebApplication1.Service.Abstracts
{
    public interface IRequestService
    {
        Request CreateRequest(RequestCreateDto requestCreateDto, int employeeId); // Tạo request với EmployeeId từ tham số
        RequestFindDto FindRequestById(int id); // Tìm request bằng Id
        IEnumerable<RequestFindDto> GetRequestsByEmployeeId(int employeeId); // Lấy request của một nhân viên dựa trên EmployeeId
        IEnumerable<RequestFindDto> GetPendingRequestsByDepartmentHeadId(int departmentHeadId); // Lấy các request chờ duyệt cho trưởng phòng dựa trên DepartmentHeadId
        IEnumerable<RequestFindDto> GetApprovedRequestsForAssetManagement(); // Lấy các request đã được duyệt bởi trưởng phòng cho bộ phận quản lý tài sản
        void ApproveRequest(int id); // Duyệt request dựa trên Id
        void RejectRequest(int id); // Từ chối request dựa trên Id
        void DeleteRequest(int id); // Xóa request dựa trên Id
        void ApproveAssetRequest(int id); // Bộ phận quản lý tài sản phê duyệt request dựa trên Id
    }
}
