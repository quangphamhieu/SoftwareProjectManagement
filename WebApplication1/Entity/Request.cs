using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.Entity;

namespace WebApplication1.Entity;

[Table("Requests")]
public partial class Request
{
    [Key]
    public int Id { get; set; }

    public int EmployeeId { get; set; }

    public int StatusId { get; set; }

    [Required]
    public DateTime CreatedDate { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public DateTime? FinalizedDate { get; set; }

    [ForeignKey("EmployeeId")]
    public virtual User Employee { get; set; } = null!;

    [ForeignKey("StatusId")]
    public virtual RequestStatus Status { get; set; } = null!;

    public virtual ICollection<RequestItem> RequestItems { get; set; } = new List<RequestItem>();
}
