﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using WebApplication1.DTO.Request;

namespace WebApplication1.DTO.Create;

public class RequestCreateDto
{
    [Required]
    public int EmployeeId { get; set; }
    public List<RequestItemDto> RequestItems { get; set; } = new();
}