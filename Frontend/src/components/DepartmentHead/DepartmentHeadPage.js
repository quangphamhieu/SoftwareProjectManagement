import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function DepartmentHeadPage() {
  const [requests, setRequests] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [departmentHeadId, setDepartmentHeadId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");
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
    fetchPendingRequestsByDepartmentHeadId();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang đăng nhập
  };
  // Hàm lấy tất cả yêu cầu đang chờ duyệt theo ID trưởng bộ phận
  useEffect(() => {
    fetchPendingRequestsByDepartmentHeadId();
  }, []);

  const fetchPendingRequestsByDepartmentHeadId = async () => {
    try {
      const departmentHeadId = localStorage.getItem("userId"); // Lấy ID từ localStorage
      if (!departmentHeadId)
        throw new Error("Không tìm thấy ID trưởng bộ phận.");

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

  // Hàm duyệt yêu cầu
  const approveRequest = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/approve/${id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Không thể duyệt yêu cầu.");
      setMessage("Yêu cầu đã được duyệt thành công.");
      fetchPendingRequestsByDepartmentHeadId();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi duyệt yêu cầu.");
    }
  };

  // Hàm từ chối yêu cầu
  const rejectRequest = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/reject/${id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Không thể từ chối yêu cầu.");
      setMessage("Yêu cầu đã bị từ chối.");
      fetchPendingRequestsByDepartmentHeadId();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi từ chối yêu cầu.");
    }
  };

  return (
    <div className="content-container">
      <div className="header">
        <h1>Chức Vụ Trưởng Bộ Phận</h1>
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
      {/* Ô tìm kiếm theo ID trưởng bộ phận */}
      {/* <div className="search-container">
        <input
          type="text"
          placeholder="Nhập ID trưởng bộ phận để xem yêu cầu"
          value={departmentHeadId}
          onChange={(e) => setDepartmentHeadId(e.target.value)}
          className="search-input"
        />
        <button
          onClick={fetchPendingRequestsByDepartmentHeadId}
          className="search-button"
        >
          <i className="fas fa-search"></i>
        </button>
      </div> */}

      {/* Danh sách yêu cầu */}
      <ul className="request-list">
        {requests.map((request) => (
          <ul key={request.id} className="box-nhanvien">
            <p>
              <strong>ID Yêu cầu:</strong> {request.id}
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
            <button onClick={() => rejectRequest(request.id)}>Từ chối</button>
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default DepartmentHeadPage;
