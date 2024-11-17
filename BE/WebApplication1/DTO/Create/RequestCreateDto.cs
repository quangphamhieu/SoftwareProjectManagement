using WebApplication1.DTO.Request;

public class RequestCreateDto
{
    public int EmployeeId { get; set; } // Thêm trường EmployeeId
    public List<RequestItemDto> RequestItems { get; set; }
}
