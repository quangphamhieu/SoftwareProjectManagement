import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function AssetListPage() {
  const [assets, setAssets] = useState([]); // Danh sách tài sản
  const [searchAssetName, setSearchAssetName] = useState(""); // Tên tài sản cần tìm
  const [foundAssets, setFoundAssets] = useState([]); // Lưu kết quả tìm kiếm (mảng tài sản)
  const [message, setMessage] = useState(""); // Thông báo lỗi hoặc trạng thái
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
      if (userId) {
        try {
          const response = await fetch(
            `https://localhost:7028/api/user/${userId}`
          );
          if (!response.ok)
            throw new Error("Không thể tải thông tin người dùng.");
          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng:", error);
        }
      }
    };

    fetchUserInfo();
  }, []);
  useEffect(() => {
    fetchAllAssets();
  }, []);

  const handleBack = () => {
    navigate("/department-head"); // Điều hướng về EmployeePage
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  // Hàm lấy toàn bộ danh sách tài sản
  const fetchAllAssets = async () => {
    try {
      const response = await fetch("https://localhost:7028/api/Asset");
      if (!response.ok) throw new Error("Failed to fetch assets.");
      const data = await response.json();
      setAssets(data);
      setFoundAssets([]); // Xóa kết quả tìm kiếm trước đó
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi tải danh sách tài sản.");
    }
  };

  // Hàm tìm kiếm tài sản theo tên
  const handleSearchByAssetName = async () => {
    if (searchAssetName === "") {
      // Nếu tên tài sản rỗng, lấy toàn bộ danh sách tài sản
      fetchAllAssets();
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7028/api/Asset/search?name=${searchAssetName}`
      );
      if (!response.ok) throw new Error("Tài sản không tồn tại.");
      const data = await response.json();
      setFoundAssets(data); // Lưu kết quả tìm kiếm vào foundAssets
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Không tìm thấy tài sản với tên đã nhập.");
      setFoundAssets([]);
    }
  };

  return (
    <div className="content-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Trở về
      </button>
      <div className="header">
        <h1>Danh sách tài sản</h1>
        {userInfo ? (
          <div
            className="user-dropdown"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="user-name">User: {userInfo.fullName}</span>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <p>ID: {userInfo.id}</p>
                <p>Email: {userInfo.email}</p>
                <p>Họ và Tên: {userInfo.fullName}</p>
                <p>Chức vụ: {userInfo.roleName}</p>
                <button onClick={handleLogout} className="logout-button">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </div>

      {/* Ô tìm kiếm tài sản */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Nhập tên tài sản cần tìm"
          value={searchAssetName}
          onChange={(e) => setSearchAssetName(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearchByAssetName} className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      {/* Hiển thị kết quả tìm thấy */}
      {foundAssets.length > 0 ? (
        <ul className="asset-list">
          {foundAssets.map((asset) => (
            <ul key={asset.id} className="box-nhanvien">
              <p>ID Tài sản: {asset.id}</p>
              <p>Tên tài sản: {asset.name}</p>
              <p>Mô tả: {asset.description}</p>
              <p>Số lượng: {asset.quantity}</p>
            </ul>
          ))}
        </ul>
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
