using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTO.Create
{
    public class AssetCreateDto
    {
        [Key] // Nếu bạn muốn Id tự động tạo
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
