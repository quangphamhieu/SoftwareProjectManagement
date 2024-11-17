import React, { useState, useEffect, useRef } from "react";
import "../../styles/admin.css"; // Import file CSS
import { useNavigate } from "react-router-dom";
function AdminPage() {
  const [employees, setEmployees] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentHeadId, setDepartmentHeadId] = useState("");
  const [searchFullName, setSearchFullName] = useState(""); // Tìm kiếm theo tên đầy đủ
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Lưu nhân viên được tìm thấy
  const [message, setMessage] = useState("");
  const [isAddMode, setIsAddMode] = useState(false); // Để điều khiển hiển thị form thêm
  const [isEditMode, setIsEditMode] = useState(false); // Để điều khiển hiển thị form sửa
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [messageTimestamp, setMessageTimestamp] = useState("");
  const messageRef = useRef(null);
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
  // Kích hoạt scroll và focus khi thông báo được cập nhật (THÊM MỚI)
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" }); // Cuộn tới thông báo
      messageRef.current.focus(); // Focus vào thông báo
    }

    // Tự động ẩn thông báo sau 5 giây (THÊM MỚI)
    const timer = setTimeout(() => {
      setMessage(""); // Xóa thông báo
      setMessageTimestamp(""); // Xóa thời gian thông báo
    }, 4000);

    return () => clearTimeout(timer); // Xóa timer khi component unmount
  }, [message]);
  useEffect(() => {
    fetchAllEmployees();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang đăng nhập
  };
  // Gọi API để lấy tất cả nhân viên
  const fetchAllEmployees = async () => {
    try {
      const response = await fetch("https://localhost:7028/api/User/get-all");
      if (!response.ok) throw new Error("Failed to fetch employees.");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tải danh sách nhân viên.");
    }
  };

  // Hàm tìm kiếm nhân viên theo fullName
  const handleSearchByFullName = async () => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/User/search/by-fullname?fullName=${searchFullName}`
      );
      if (!response.ok) throw new Error("Không tìm thấy nhân viên.");
      const data = await response.json();

      if (data.length === 0)
        throw new Error("Không tìm thấy nhân viên với tên đầy đủ đã nhập.");

      const employee = data[0]; // Lấy nhân viên đầu tiên nếu nhiều kết quả
      setSelectedEmployee(employee);
      setMessage("");

      // Gán giá trị từ API vào form
      setEmail(employee.email);
      setFullName(employee.fullName);
      setPassword(employee.password || ""); // Hiển thị mật khẩu (nếu cần)
      setRoleId(employee.roleId ? employee.roleId.toString() : "");
      setDepartmentHeadId(
        employee.departmentHeadId ? employee.departmentHeadId.toString() : ""
      );
    } catch (error) {
      console.error(error);
      setMessage("Không tìm thấy nhân viên với tên đầy đủ đã nhập.");
    }
  };

  // Gọi API để cập nhật thông tin nhân viên
  const handleUpdateEmployee = async (event) => {
    event.preventDefault();

    if (!selectedEmployee) {
      setMessage("Không có nhân viên nào được chọn để cập nhật.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7028/api/User/update?id=${selectedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedEmployee.id, // Truyền ID
            email,
            password,
            fullName,
            roleId: 2, // Role ID mặc định là 2
            departmentHeadId: departmentHeadId
              ? parseInt(departmentHeadId, 10)
              : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật thông tin nhân viên.");
      }

      setMessage("Thông tin nhân viên đã được cập nhật.");
      resetForm(); // Đặt lại form về trạng thái ban đầu
      setIsEditMode(false); // Ẩn form sửa
      fetchAllEmployees(); // Tải lại danh sách nhân viên đầy đủ
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi cập nhật nhân viên.");
    }
  };

  // Gọi API để thêm nhân viên mới
  const handleAddEmployee = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://localhost:7028/api/User/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          fullName: fullName,
          roleId: roleId ? parseInt(roleId, 10) : null,
          departmentHeadId: departmentHeadId
            ? parseInt(departmentHeadId, 10)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Không thể thêm nhân viên.");
      setMessage("Nhân viên đã được thêm thành công");
      resetForm();
      fetchAllEmployees(); // Cập nhật danh sách nhân viên
      setIsAddMode(false); // Ẩn form thêm
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  // Gọi API để xoá nhân viên theo ID
  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/User/delete?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Không thể xóa nhân viên.");
      setMessage("Nhân viên đã được xoá");
      fetchAllEmployees(); // Cập nhật danh sách nhân viên
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi xóa nhân viên.");
    }
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setRoleId("");
    setDepartmentHeadId("");
    setSelectedEmployee(null);
    setSearchFullName(""); // Đặt lại giá trị tên đầy đủ nhập vào
  };

  return (
    <div className="content-container">
      {" "}
      {/* Bọc nội dung trong lớp này */}
      <div>
        <div className="header">
          <h1>Quản lý nhân viên</h1>
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
        {/* Hiển thị thông báo */}
        {message && (
          <div
            ref={messageRef} // Gắn ref để focus
            tabIndex={-1} // Cho phép focus
            className="message-box animated-border" // Thêm class "animated-border"
          >
            {message}{" "}
            <span style={{ fontSize: "12px" }}>({messageTimestamp})</span>
            {/* Thêm thời gian thông báo */}
          </div>
        )}

        {/* Nút điều khiển hiển thị form thêm */}
        <button
          onClick={() => {
            setIsAddMode(!isAddMode); // Chuyển đổi trạng thái isAddMode giữa true và false
            setIsEditMode(false); // Ẩn form sửa nếu đang hiển thị
            resetForm(); // Đặt lại các trường nhập liệu nếu có
          }}
        >
          {isAddMode ? "Đóng" : "Thêm nhân viên"}
        </button>

        {/* Ô nhập tên đầy đủ và nút "Tìm kiếm" để sửa nhân viên */}
        {!isAddMode && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Nhập tên đầy đủ của nhân viên cần tìm"
              value={searchFullName}
              onChange={(e) => setSearchFullName(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearchByFullName} className="search-button">
              <i className="fas fa-search"></i> {/* Icon tìm kiếm */}
            </button>
          </div>
        )}

        {/* Hiển thị thông tin nhân viên tìm thấy và nút sửa */}
        {selectedEmployee && !isEditMode && (
          <div>
            <h3>Thông tin nhân viên</h3>
            <div className="box-nhanvien">
              <p>ID: {selectedEmployee.id}</p>
              <p>Email: {selectedEmployee.email}</p>
              <p>Password: {selectedEmployee.password}</p>
              <p>Tên đầy đủ: {selectedEmployee.fullName}</p>
              <p>Chức vụ: {selectedEmployee.roleName}</p>
              <p>
                ID người quản lý :{" "}
                {selectedEmployee.departmentHeadId
                  ? selectedEmployee.departmentHeadId
                  : "Chưa được quản lý bởi ai"}
              </p>
              {/* Nút sửa */}
              <button
                onClick={() => {
                  setSelectedEmployee(selectedEmployee); // Gán nhân viên được chọn vào trạng thái
                  setIsEditMode(true); // Hiển thị form sửa
                  setIsAddMode(false); // Tắt form thêm
                  setEmail(selectedEmployee.email || ""); // Gán email
                  setFullName(selectedEmployee.fullName || ""); // Gán tên đầy đủ
                  setPassword(selectedEmployee.password || ""); // Gán mật khẩu
                  setRoleId(
                    selectedEmployee.roleId
                      ? selectedEmployee.roleId.toString()
                      : ""
                  ); // Gán Role ID
                  setDepartmentHeadId(
                    selectedEmployee.departmentHeadId
                      ? selectedEmployee.departmentHeadId.toString()
                      : ""
                  ); // Gán ID người quản lý
                }}
              >
                Sửa
              </button>
            </div>
          </div>
        )}

        {/* Form sửa nhân viên */}
        {isEditMode && (
          <form onSubmit={handleUpdateEmployee}>
            <h3>Sửa Nhân Viên</h3>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Tên đầy đủ:</label>
            <input
              type="text"
              placeholder="Tên đầy đủ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {/* <label>Role ID:</label>
            <input
              type="text"
              value="" // Giá trị cố định là 2
              disabled // Không cho phép chỉnh sửa
            /> */}
            <label>Được quản lý bởi:</label>
            <input
              type="text"
              placeholder="Được quản lý bởi"
              value={departmentHeadId}
              onChange={(e) => setDepartmentHeadId(e.target.value)}
            />
            <button type="submit">Cập nhật</button>
          </form>
        )}

        {/* Form thêm nhân viên */}
        {isAddMode && (
          <form onSubmit={handleAddEmployee}>
            <h3>Thêm Nhân Viên</h3>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Tên đầy đủ:</label>
            <input
              type="text"
              placeholder="Tên đầy đủ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label>Role ID:</label>
            <input
              type="text"
              placeholder="Role ID"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            />
            <label>Được quản lý bởi:</label>
            <input
              type="text"
              placeholder="Được quản lý bởi "
              value={departmentHeadId}
              onChange={(e) => setDepartmentHeadId(e.target.value)}
            />
            <button type="submit">Thêm</button>
          </form>
        )}

        <h3>Danh sách nhân viên</h3>
        <ul>
          {employees.map((employee) => (
            <ul key={employee.id} className="box-nhanvien">
              <p>ID Nhân Viên: {employee.id}</p>
              <p>Email: {employee.email}</p>
              <p>Password: {employee.password}</p>
              <p>Họ Và Tên: {employee.fullName}</p>
              <p>Chức Vụ: {employee.roleName}</p>
              <p>
                ID người quản lý :{" "}
                {employee.departmentHeadId
                  ? employee.departmentHeadId
                  : "Chưa được quản lý bởi ai"}
              </p>
              <button onClick={() => handleDeleteEmployee(employee.id)}>
                Xoá
              </button>
            </ul>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
