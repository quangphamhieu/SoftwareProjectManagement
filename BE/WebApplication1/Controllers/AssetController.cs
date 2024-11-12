using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Update;
using WebApplication1.Service.Implements;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        // POST: api/asset
        [HttpPost]
        [Authorize(Roles = "AssetManager")] // Chỉ cho phép bộ phận quản lý tài sản tạo tài sản
        public IActionResult CreateAsset([FromBody] AssetCreateDto assetCreateDto)
        {
            _assetService.CreateAsset(assetCreateDto);
            return CreatedAtAction(nameof(FindAssetById), new { assetId = assetCreateDto.Id }, assetCreateDto);
        }

        // GET: api/asset/{assetId}
        [HttpGet("{assetId}")]
        [Authorize(Roles = "AssetManager, Employee")] // Cho phép cả bộ phận quản lý tài sản và nhân viên xem tài sản
        public IActionResult FindAssetById(int assetId)
        {
            var asset = _assetService.FindAssetById(assetId);
            if (asset == null)
            {
                return NotFound();
            }
            return Ok(asset);
        }

        // GET: api/asset
        [HttpGet]
        [Authorize(Roles = "AssetManager, Employee")] // Cho phép cả bộ phận quản lý tài sản và nhân viên xem tất cả tài sản
        public IEnumerable<AssetFindDto> GetAllAssets()
        {
            return _assetService.GetAllAssets();
        }

        // PUT: api/asset/{assetId}
        [HttpPut("{assetId}")]
        [Authorize(Roles = "AssetManager")] // Chỉ cho phép bộ phận quản lý tài sản cập nhật tài sản
        public IActionResult UpdateAsset(int assetId, [FromBody] AssetUpdateDto assetUpdateDto)
        {
            _assetService.UpdateAsset(assetId, assetUpdateDto);
            return NoContent();
        }

        // DELETE: api/asset/{assetId}
        [HttpDelete("{assetId}")]
        [Authorize(Roles = "AssetManager")] // Chỉ cho phép bộ phận quản lý tài sản xóa tài sản
        public IActionResult DeleteAsset(int assetId)
        {
            _assetService.DeleteAsset(assetId);
            return NoContent();
        }
    }
}
