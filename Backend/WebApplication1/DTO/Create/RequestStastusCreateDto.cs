using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTO.Create
{
    public class RequestStatusCreateDto
    {
        [Required]
        public string Name { get; set; } = null!;
    }
}
