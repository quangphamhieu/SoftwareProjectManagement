namespace WebApplication1.DTO.Find;

public class UserFindDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string RoleName { get; set; } = null!;
    public int? DepartmentHeadId { get; set; }
}
