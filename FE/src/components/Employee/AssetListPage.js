import React, { useState, useEffect } from "react";

function AssetListPage() {
  const [assets, setAssets] = useState([]); // Danh sách tài sản
  const [searchAssetId, setSearchAssetId] = useState(""); // Dùng để lưu assetId cần tìm
  const [foundAsset, setFoundAsset] = useState(null); // Lưu kết quả tìm thấy
  const [message, setMessage] = useState(""); // Thông báo lỗi hoặc trạng thái

  useEffect(() => {
    fetchAllAssets();
  }, []);

  // Hàm lấy toàn bộ danh sách tài sản
  const fetchAllAssets = async () => {
    try {
      const response = await fetch("https://localhost:7028/api/Asset");
      if (!response.ok) throw new Error("Failed to fetch assets.");
      const data = await response.json();
      setAssets(data);
      setFoundAsset(null); // Xóa kết quả tìm kiếm trước đó
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi tải danh sách tài sản.");
    }
  };

  // Hàm tìm kiếm tài sản theo ID
  const handleSearchByAssetId = async () => {
    if (searchAssetId === "") {
      // Nếu assetId rỗng, lấy toàn bộ danh sách tài sản
      fetchAllAssets();
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7028/api/Asset/${searchAssetId}`
      );
      if (!response.ok) throw new Error("Tài sản không tồn tại.");
      const data = await response.json();
      setFoundAsset(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Không tìm thấy tài sản với ID đã nhập.");
      setFoundAsset(null);
    }
  };

  return (
    <div className="content-container">
      <h1>Danh sách tài sản</h1>

      {/* Ô tìm kiếm tài sản */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Nhập ID tài sản cần tìm"
          value={searchAssetId}
          onChange={(e) => setSearchAssetId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearchByAssetId} className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      {/* Hiển thị kết quả tìm thấy */}
      {foundAsset ? (
        <div className="asset-details">
          <p>ID Tài sản: {foundAsset.id}</p>
          <p>Tên tài sản: {foundAsset.name}</p>
          <p>Mô tả: {foundAsset.description}</p>
          <p>Số lượng: {foundAsset.quantity}</p>
        </div>
      ) : (
        <ul className="asset-list">
          {assets.map((asset) => (
            <ul key={asset.id} className="box-nhanvien">
              <p>ID Tài sản: {asset.id}</p>
              <p>Tên tài sản: {asset.name}</p>
              <p>Mô tả: {asset.description}</p>
              <p>Số lượng: {asset.quantity}</p>
            </ul>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssetListPage;
