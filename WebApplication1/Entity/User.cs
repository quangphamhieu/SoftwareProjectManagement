using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Entity;

[Table("Users")]
public partial class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;

    [Required]
    public string FullName { get; set; } = null!;

    public int? DepartmentHeadId { get; set; }

    [ForeignKey("DepartmentHeadId")]
    public virtual User? DepartmentHead { get; set; }

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();
}
