using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Entity
{
    [Table("Requests")]
    public partial class Request
    {
        [Key]
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeEmail { get; set; } = string.Empty;
        public int? DepartmentHeadId { get; set; } 
        public string DepartmentHeadName { get; set; } = string.Empty;

        public int StatusId { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [ForeignKey("EmployeeId")]
        public virtual User Employee { get; set; } = null!;

        [ForeignKey("StatusId")]
        public virtual RequestStatus Status { get; set; } = null!;

        public virtual ICollection<RequestItem> RequestItems { get; set; } = new List<RequestItem>();
    }
}
