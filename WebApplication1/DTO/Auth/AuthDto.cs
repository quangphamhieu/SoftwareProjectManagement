﻿using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTO.Auth
{
    public class LoginDto
    {
        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
