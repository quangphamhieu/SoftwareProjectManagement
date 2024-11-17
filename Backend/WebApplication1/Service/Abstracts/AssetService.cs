using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DbContexts;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Update;
using WebApplication1.Entity;
using WebApplication1.Service.Implements;

namespace WebApplication1.Service.Abstracts
{
    public class AssetService : IAssetService
    {
        private readonly ApplicationDbContext _context;

        public AssetService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void CreateAsset(AssetCreateDto assetCreateDto)
        {
            var asset = new Asset
            {
                Name = assetCreateDto.Name,
                Description = assetCreateDto.Description,
                Quantity = assetCreateDto.Quantity
            };

            _context.Assets.Add(asset);
            _context.SaveChanges();
        }

        public AssetFindDto FindAssetById(int assetId)
        {
            var asset = _context.Assets.Find(assetId);
            if (asset == null)
                throw new KeyNotFoundException("Asset not found");

            return new AssetFindDto
            {
                Id = asset.Id,
                Name = asset.Name,
                Description = asset.Description,
                Quantity = asset.Quantity
            };
        }

        public IEnumerable<AssetFindDto> GetAllAssets()
        {
            return _context.Assets.Select(asset => new AssetFindDto
            {
                Id = asset.Id,
                Name = asset.Name,
                Description = asset.Description,
                Quantity = asset.Quantity
            }).ToList();
        }

        public void UpdateAsset(int assetId, AssetUpdateDto assetUpdateDto)
        {
            var asset = _context.Assets.Find(assetId);
            if (asset == null)
                throw new KeyNotFoundException("Asset not found");

            asset.Name = assetUpdateDto.Name;
            asset.Description = assetUpdateDto.Description;
            asset.Quantity = assetUpdateDto.Quantity;

            _context.Assets.Update(asset);
            _context.SaveChanges();
        }

        public void DeleteAsset(int assetId)
        {
            var asset = _context.Assets.Find(assetId);
            if (asset == null)
                throw new KeyNotFoundException("Asset not found");

            _context.Assets.Remove(asset);
            _context.SaveChanges();
        }
        public IEnumerable<AssetFindDto> FindAssetsByName(string assetName)
        {
            return _context.Assets
                .Where(asset => asset.Name.Contains(assetName))  // Filter by name
                .Select(asset => new AssetFindDto
                {
                    Id = asset.Id,
                    Name = asset.Name,
                    Description = asset.Description,
                    Quantity = asset.Quantity
                })
                .ToList();
        }
    }
}
