using WebApplication1.DTO.Request;

namespace WebApplication1.DTO.Update;

public class RequestUpdateDto
{
    public int Id { get; set; }
    public int StatusId { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public List<RequestItemDto> RequestItems { get; set; } = new List<RequestItemDto>();
}
