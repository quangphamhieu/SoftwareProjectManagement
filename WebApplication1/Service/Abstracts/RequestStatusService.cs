using System.Collections.Generic;
using System.Linq;
using WebApplication1.DbContexts;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Update;
using WebApplication1.Entity;
using WebApplication1.Service.Abstracts;

namespace WebApplication1.Service.Implements
{
    public class RequestStatusService : IRequestStatusService
    {
        private readonly ApplicationDbContext _context;

        public RequestStatusService(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<RequestStatusFindDto> GetAllRequestStatuses()
        {
            return _context.RequestStatuses.Select(rs => new RequestStatusFindDto
            {
                Id = rs.Id,
                Name = rs.Name
            }).ToList();
        }


        public void CreateRequestStatus(RequestStatusCreateDto requestStatusDto)
        {
            var newStatus = new RequestStatus
            {
                Name = requestStatusDto.Name
            };

            _context.RequestStatuses.Add(newStatus);
            _context.SaveChanges();
        }



        public void DeleteRequestStatus(int id)
        {
            var status = _context.RequestStatuses.FirstOrDefault(rs => rs.Id == id);
            if (status == null)
                throw new Exception("Request status not found");

            _context.RequestStatuses.Remove(status);
            _context.SaveChanges();
        }
    }
}
