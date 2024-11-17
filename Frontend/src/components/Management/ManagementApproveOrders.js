import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
function ManagementApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Hàm lấy danh sách các đơn đã được trưởng bộ phận duyệt
  const fetchApprovedRequests = async () => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/approved-requests`
      );
      if (!response.ok) throw new Error("Không thể tải danh sách yêu cầu.");
      const data = await response.json();
      setRequests(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tải danh sách yêu cầu.");
    }
  };

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
  const handleBack = () => {
    navigate("/management"); // Điều hướng về EmployeePage
  };
  useEffect(() => {
    fetchApprovedRequests();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang đăng nhập
  };
  // Hàm duyệt yêu cầu
  const approveRequest = async (requestId) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/assetManagement/approve/${requestId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Không thể duyệt yêu cầu.");
      setMessage("Yêu cầu đã được bộ phận quản lý duyệt thành công.");
      fetchApprovedRequests(); // Cập nhật lại danh sách sau khi duyệt
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi duyệt yêu cầu.");
    }
  };

  return (
    <div className="content-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Trở về
      </button>
      <div className="header">
        <h1>Chức Vụ Bộ Phận Quản Lý </h1>
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
      {message && <div className="message">{message}</div>}

      <ul className="request-list">
        {requests.map((request) => (
          <ul key={request.id} className="box-nhanvien">
            <p>
              <strong>ID Đơn:</strong> {request.id}
            </p>
            <p>
              <strong>Tên nhân viên:</strong> {request.employeeName}
            </p>
            <p>
              <strong>Trạng thái:</strong> {request.statusName}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(request.createdDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Chi tiết tài sản mượn:</strong>
            </p>
            <ul>
              {request.requestItems.map((item) => (
                <li key={item.assetId}>
                  <p>ID Tài sản: {item.assetId}</p>
                  <p>Số lượng: {item.quantity}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => approveRequest(request.id)}>Duyệt</button>
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default ManagementApprovalPage;
