using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Entity;

[Table("RequestItems")]
public partial class RequestItem
{
    [Key]
    public int Id { get; set; }

    public int RequestId { get; set; }

    public int AssetId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [ForeignKey("RequestId")]
    public virtual Request Request { get; set; } = null!;

    [ForeignKey("AssetId")]
    public virtual Asset Asset { get; set; } = null!;
}
