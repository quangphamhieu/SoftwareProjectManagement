import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messageRef = useRef(null); // Tham chiếu đến thông báo
  const [isAddMode, setIsAddMode] = useState(false); // Trạng thái thêm đơn
  const [newOrder, setNewOrder] = useState({
    employeeId: "",
    requestItems: [{ assetId: "", quantity: "" }],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" }); // Cuộn đến thông báo
      messageRef.current.focus(); // Tập trung vào thông báo
    }
  }, [message]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Xóa thông báo sau 3 giây
      }, 2000);
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [message]);
  // Lấy thông tin người dùng và danh sách đơn tự động
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId"); // Lấy ID người dùng từ localStorage
      if (userId) {
        try {
          const response = await fetch(
            `https://localhost:7028/api/user/${userId}`
          );
          if (!response.ok)
            throw new Error("Không thể tải thông tin người dùng.");
          const data = await response.json();
          setUserInfo(data);

          // Lấy danh sách đơn của chính người dùng
          fetchOrdersByEmployeeId(userId);
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng:", error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const fetchOrdersByEmployeeId = async (employeeId) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/employee-requests/${employeeId}`
      );
      if (!response.ok) throw new Error("Không thể tải danh sách đơn.");
      const data = await response.json();
      setOrders(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tải danh sách đơn.");
    }
  };

  const handleBack = () => {
    navigate("/employee");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleAddRequestItem = () => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      requestItems: [...prevOrder.requestItems, { assetId: "", quantity: "" }],
    }));
  };

  const createOrder = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://localhost:7028/api/Request", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error("Không thể tạo đơn.");

      setMessage("Đơn đã được tạo thành công.");

      // Đặt lại trạng thái form
      setNewOrder({
        employeeId: userInfo?.id || "",
        requestItems: [{ assetId: "", quantity: "" }],
      });

      // Đóng form thêm đơn
      setIsAddMode(false);

      // Cập nhật danh sách đơn
      if (userInfo?.id) {
        await fetchOrdersByEmployeeId(userInfo.id);
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tạo đơn.");
    }
  };
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Không thể xóa đơn.");

      setMessage("Đơn đã được xóa thành công.");

      // Chờ 3 giây trước khi tải lại danh sách
      setTimeout(async () => {
        if (userInfo?.id) {
          await fetchOrdersByEmployeeId(userInfo.id);
        }
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi xóa đơn:", error);
      setMessage("Đơn này không thể xóa vì đã được duyệt.");
    }
  };

  return (
    <div className="content-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Trở về
      </button>
      <div className="header">
        <h1>Quản lý đơn</h1>
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
          ref={messageRef}
          tabIndex={-1} // Đảm bảo phần tử có thể được focus
          className="message-box"
          style={{
            outline: "none", // Loại bỏ đường viền focus (tùy chọn)
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#dff0d8", // Màu xanh lá nhạt
            color: "#3c763d", // Màu chữ xanh lá
            border: "1px solid #d6e9c6", // Đường viền màu xanh lá
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}

      {/* Nút Thêm/Đóng đơn */}
      <button
        onClick={() => {
          setIsAddMode(!isAddMode); // Chuyển đổi trạng thái thêm/đóng
          setNewOrder({
            employeeId: userInfo?.id || "",
            requestItems: [{ assetId: "", assetName: "", quantity: "" }],
          }); // Đặt lại form
        }}
      >
        {isAddMode ? "Đóng" : "Thêm đơn"}
      </button>

      {/* Form tạo đơn */}
      {isAddMode && (
        <form onSubmit={createOrder} className="create-order-form">
          <h3>Tạo đơn mới</h3>

          <label>
            ID nhân viên: <span className="id_nhanvien">*</span>
          </label>
          <input
            type="text"
            placeholder="ID nhân viên"
            value={newOrder.employeeId}
            onChange={(e) =>
              setNewOrder({ ...newOrder, employeeId: e.target.value })
            }
            required
            disabled // ID nhân viên tự động lấy và không thể chỉnh sửa
          />

          {newOrder.requestItems.map((item, index) => (
            <div key={index} className="request-item">
              <label className="id_taisan">ID tài sản:</label>
              <input
                type="text"
                placeholder="ID tài sản"
                value={item.assetId}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    requestItems: newOrder.requestItems.map((ri, i) =>
                      i === index ? { ...ri, assetId: e.target.value } : ri
                    ),
                  })
                }
                required
              />

              <label>Tên tài sản:</label>
              <input
                type="text"
                placeholder="Tên tài sản"
                value={item.assetName}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    requestItems: newOrder.requestItems.map((ri, i) =>
                      i === index ? { ...ri, assetName: e.target.value } : ri
                    ),
                  })
                }
              />

              <label>Số lượng:</label>
              <input
                type="number"
                placeholder="Số lượng"
                value={item.quantity}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    requestItems: newOrder.requestItems.map((ri, i) =>
                      i === index ? { ...ri, quantity: e.target.value } : ri
                    ),
                  })
                }
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddRequestItem}
            className="add-item-button"
          >
            + Thêm tài sản
          </button>

          <button type="submit" className="create-order-button">
            Tạo đơn
          </button>
        </form>
      )}

      <p className="TextDsdon"> Danh sách đơn của tôi</p>
      {/* Danh sách đơn */}
      <ul className="order-list">
        {orders.map((order) => (
          <ul key={order.id} className="box-nhanvien">
            <p>
              <strong>ID Đơn:</strong> {order.id}
            </p>
            <p>
              <strong>Tên nhân viên:</strong> {order.employeeName}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.statusName}
            </p>
            <p>
              <strong>ID nhân viên:</strong> {order.employeeId}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(order.createdDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Chi tiết tài sản mượn:</strong>
            </p>
            <ul>
              {order.requestItems.map((item) => (
                <li key={item.assetId}>
                  <p>ID Tài sản: {item.assetId}</p>
                  <p>Tên tài sản: {item.assetName}</p>
                  <p>Số lượng: {item.quantity}</p>
                </li>
              ))}
            </ul>
            {/* Nút xóa đơn */}
            <button
              onClick={() => deleteOrder(order.id)}
              className="delete-order-button"
            >
              Xóa đơn
            </button>
          </ul>
        ))}
      </ul>

      {/* {message && <p>{message}</p>} */}
    </div>
  );
}

export default OrderManagementPage;
