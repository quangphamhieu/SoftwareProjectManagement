namespace WebApplication1.DTO.Find
{
    public class AssetFindDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
