import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AssetListPage from "./components/Employee/AssetListPage";
import OrderManagementPage from "./components/Employee/OrderManagementPage";
import AdminPage from "./components/Admin/AdminPage";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-item">
          <div className="dropdown">
            <button className="dropdown-btn">Nhân Viên</button>
            <div className="dropdown-content">
              <Link to="/assets">Danh sách tài sản</Link>
              <Link to="/orders">Quản lý đơn</Link>
            </div>
          </div>
        </div>
        <div className="nav-item">
          <Link to="/admin">Quản Lý Nhân Viên (Admin)</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/assets" element={<AssetListPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
