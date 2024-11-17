import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";

function ManagementPage() {
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
  const handleNavigateToManageAssets = () => {
    navigate("/management/assets"); // Điều hướng đến trang Quản lý tài sản
  };

  const handleNavigateToApproveOrders = () => {
    navigate("/management/approve-orders"); // Điều hướng đến trang Duyệt đơn
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Xóa token
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="content-container">
      <div className="header">
        <h1>Bộ Phận Quản Lý</h1>
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
      <div className="options-container">
        <button
          onClick={handleNavigateToManageAssets}
          className="option-button"
        >
          Quản Lý Tài Sản
        </button>
        <button
          onClick={handleNavigateToApproveOrders}
          className="option-button"
        >
          Duyệt Đơn
        </button>
      </div>
    </div>
  );
}

export default ManagementPage;
