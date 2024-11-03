namespace WebApplication1.DTO.Update;

public class UserUpdateDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public int RoleId { get; set; }
    public int? DepartmentHeadId { get; set; }
}
