using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;

namespace WebApplication1.Service.Abstracts
{
    public interface IRequestStatusService
    {
        IEnumerable<RequestStatusFindDto> GetAllRequestStatuses();
        void CreateRequestStatus(RequestStatusCreateDto requestStatusDto);
        void DeleteRequestStatus(int id);
    }
}
