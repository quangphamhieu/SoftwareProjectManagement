using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;

namespace WebApplication1.Service.Abstracts
{
    public interface IRequestService
    {
        void CreateRequest(RequestCreateDto requestDto);
        RequestFindDto FindRequestById(int id);
        IEnumerable<RequestFindDto> GetRequestsByEmployeeId(int employeeId);
        IEnumerable<RequestFindDto> GetPendingRequestsByDepartmentHeadId(int departmentHeadId);
        IEnumerable<RequestFindDto> GetApprovedRequestsForAssetManagement();
        void ApproveRequest(int id);
        void RejectRequest(int id);
        void DeleteRequest(int id);
        void ApproveAssetRequest(int id);
    }
}
