namespace WebApplication1.DTO.Create;

public class UserCreateDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public int RoleId { get; set; }
    public int? DepartmentHeadId { get; set; }  // Optional department head
}
