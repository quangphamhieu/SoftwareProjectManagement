using System.Collections.Generic;
using WebApplication1.DTO.Find;
using WebApplication1.DTO.Create;
using WebApplication1.DTO.Update;

namespace WebApplication1.Service.Implements
{
    public interface IAssetService
    {
        void CreateAsset(AssetCreateDto assetCreateDto);
        AssetFindDto FindAssetById(int assetId);
        IEnumerable<AssetFindDto> GetAllAssets();
        void UpdateAsset(int assetId, AssetUpdateDto assetUpdateDto);
        void DeleteAsset(int assetId);
    }
}
