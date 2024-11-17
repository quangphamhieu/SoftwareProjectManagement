import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";

function DepartmentHeadPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleNavigateToAssets = () => {
    navigate("/department-head/assets");
  };

  const handleNavigateToApproveOrders = () => {
    navigate("/department-head/approve-orders");
  };

  return (
    <div className="content-container">
      <div className="header">
        <h1>Trưởng Bộ Phận</h1>
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
        <button onClick={handleNavigateToAssets} className="option-button">
          Danh sách tài sản
        </button>
        <button
          onClick={handleNavigateToApproveOrders}
          className="option-button"
        >
          Duyệt đơn
        </button>
      </div>
    </div>
  );
}

export default DepartmentHeadPage;
