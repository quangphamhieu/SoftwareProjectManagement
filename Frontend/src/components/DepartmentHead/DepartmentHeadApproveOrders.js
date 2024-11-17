import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function DepartmentHeadApproveOrders() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchPendingRequests();
  }, []);

  const fetchUserInfo = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`https://localhost:7028/api/user/${userId}`);
      if (!response.ok) throw new Error("Không thể tải thông tin người dùng.");
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  const fetchPendingRequests = async () => {
    const departmentHeadId = localStorage.getItem("userId");
    if (!departmentHeadId) return;

    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/pending-requests/${departmentHeadId}`
      );
      if (!response.ok) throw new Error("Không thể tải danh sách yêu cầu.");
      const data = await response.json();
      setRequests(data);
      setMessage("Danh sách yêu cầu đã được tải thành công.");
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tải danh sách yêu cầu.");
    }
  };

  const approveRequest = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/approve/${id}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Không thể duyệt yêu cầu.");
      setMessage("Yêu cầu đã được duyệt thành công.");
      fetchPendingRequests();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi duyệt yêu cầu.");
    }
  };

  const rejectRequest = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/reject/${id}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Không thể từ chối yêu cầu.");
      setMessage("Yêu cầu đã bị từ chối.");
      fetchPendingRequests();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi từ chối yêu cầu.");
    }
  };

  const handleBack = () => {
    navigate("/department-head");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="content-container">
      {/* Nút trở về */}
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Trở về
      </button>

      {/* Header */}
      <div className="header">
        <h1>Duyệt Yêu Cầu</h1>
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

      {/* Thông báo */}
      {message && <div className="message">{message}</div>}

      {/* Danh sách yêu cầu */}
      <ul className="request-list">
        {requests.map((request) => (
          <ul key={request.id} className="box-nhanvien">
            <p>
              <strong>ID Yêu cầu:</strong> {request.id}
            </p>
            <p>
              <strong>Nhân viên:</strong> {request.employeeName}
            </p>
            <p>
              <strong>Trạng thái:</strong> {request.statusName}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(request.createdDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Lý do mượn:</strong> {request.reason || "Không có lý do"}
            </p>
            <p>
              <strong>Chi tiết tài sản:</strong>
            </p>
            <ul>
              {request.requestItems.map((item) => (
                <li key={item.assetId}>
                  <p>ID Tài sản: {item.assetId}</p>
                  <p>Tên tài sản: {item.assetName}</p>
                  <p>Số lượng: {item.quantity}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => approveRequest(request.id)}>Duyệt</button>
            <button onClick={() => rejectRequest(request.id)}>Từ chối</button>
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default DepartmentHeadApproveOrders;
