using WebApplication1.DTO.Request;

public class RequestFindDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } // Include Employee's Full Name
    public string EmployeeEmail { get; set; } // Include Employee's Email
    public int? DepartmentHeadId { get; set; } // Nullable if DepartmentHead might not exist
    public string DepartmentHeadName { get; set; } // Include Department Head's Name
    public string StatusName { get; set; } // Status of the request
    public DateTime CreatedDate { get; set; } // Date the request was created
    public List<RequestItemDto> RequestItems { get; set; } // List of request items
}
