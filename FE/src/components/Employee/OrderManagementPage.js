import React, { useState } from "react";

function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [message, setMessage] = useState("");
  const [newOrder, setNewOrder] = useState({
    employeeId: "",
    requestItems: [{ assetId: "", quantity: "" }],
  });

  // Hàm lấy tất cả đơn theo ID nhân viên
  const fetchOrdersByEmployeeId = async () => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/employee-requests/${employeeId}`
      );
      if (!response.ok) throw new Error("Không thể tải danh sách đơn.");
      const data = await response.json();
      setOrders(data);
      setMessage("Danh sách đơn đã được tải thành công.");
    } catch (error) {
      console.error(error);
      setMessage("");
    }
  };

  // Hàm xóa đơn theo ID Request
  const deleteOrderByRequestId = async () => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Request/${requestId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Không thể xóa đơn.");
      setMessage("Đơn đã được xóa thành công.");
      setRequestId(""); // Clear the request ID field
    } catch (error) {
      console.error(error);
      setMessage("Không thể xóa đơn. Đơn chỉ có thể bị xóa nếu chưa duyệt.");
    }
  };

  // Hàm tạo đơn mới
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
      setNewOrder({
        employeeId: "",
        requestItems: [{ assetId: "", quantity: "" }],
      }); // Reset form
      fetchOrdersByEmployeeId();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tạo đơn.");
    }
  };

  return (
    <div className="content-container">
      <h1>Quản lý đơn</h1>

      {/* Tìm kiếm đơn theo ID nhân viên */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Nhập ID nhân viên để xem đơn"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="search-input"
        />
        <button onClick={fetchOrdersByEmployeeId} className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Tìm kiếm đơn theo ID Request để xóa */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Nhập ID Request để xóa"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          className="search-input"
        />
        <button onClick={deleteOrderByRequestId} className="search-button">
          <i className="fas fa-trash" id="thung_rac"></i>
        </button>
      </div>

      {/* Form tạo đơn */}
      <form onSubmit={createOrder} className="create-order-form">
        <h3>Tạo đơn mới</h3>
        <label>ID nhân viên:</label>
        <input
          type="text"
          placeholder="ID nhân viên"
          value={newOrder.employeeId}
          onChange={(e) =>
            setNewOrder({ ...newOrder, employeeId: e.target.value })
          }
          required
        />
        <label>ID tài sản:</label>
        <input
          type="text"
          placeholder="ID tài sản"
          value={newOrder.requestItems[0].assetId}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              requestItems: [
                { ...newOrder.requestItems[0], assetId: e.target.value },
              ],
            })
          }
          required
        />
        <label>Tên tài sản:</label>
        <input
          type="text"
          placeholder="Tên tài sản"
          value={newOrder.requestItems[0].assetName || ""}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              requestItems: [
                { ...newOrder.requestItems[0], assetName: e.target.value },
              ],
            })
          }
        />
        <label>Số lượng:</label>
        <input
          type="number"
          placeholder="Số lượng"
          value={newOrder.requestItems[0].quantity}
          onChange={(e) =>
            setNewOrder({
              ...newOrder,
              requestItems: [
                { ...newOrder.requestItems[0], quantity: e.target.value },
              ],
            })
          }
          required
        />
        <button type="submit">Tạo đơn</button>
      </form>

      {message && <div className="message">{message}</div>}

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
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default OrderManagementPage;
