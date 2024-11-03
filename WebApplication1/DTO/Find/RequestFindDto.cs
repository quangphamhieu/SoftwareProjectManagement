using System;
using System.Collections.Generic;
using WebApplication1.DTO.Request;  // Thêm dòng này

namespace WebApplication1.DTO.Find;

public class RequestFindDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string StatusName { get; set; } = null!;
    public DateTime CreatedDate { get; set; }
    public List<RequestItemDto> RequestItems { get; set; } = new();
}
