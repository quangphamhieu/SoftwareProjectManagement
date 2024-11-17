import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/Admin/AdminPage";
import EmployeePage from "./components/Employee/EmployeePage";
import AssetListPage from "./components/Employee/AssetListPage";
import OrderManagementPage from "./components/Employee/OrderManagementPage";
import DepartmentHeadPage from "./components/DepartmentHead/DepartmentHeadPage"; // Trang chính của Trưởng Bộ Phận
import AssetListPageDepartmentHead from "./components/DepartmentHead/AssetListPage"; // Quản lý tài sản
import DepartmentHeadApproveOrders from "./components/DepartmentHead/DepartmentHeadApproveOrders"; // Duyệt đơn
import ManagementPage from "./components/Management/ManagementPage"; // Quản lý chung
import ManageAssets from "./components/Management/ManageAssets"; // Thêm tài sản
import ManagementApproveOrders from "./components/Management/ManagementApproveOrders"; // Duyệt đơn trong Management

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Trang Đăng Nhập */}
        <Route path="/" element={<LoginPage />} />

        {/* Trang Admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Trang Nhân Viên */}
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/employee/assets" element={<AssetListPage />} />
        <Route path="/employee/orders" element={<OrderManagementPage />} />

        {/* Trang Trưởng Bộ Phận */}
        <Route path="/department-head" element={<DepartmentHeadPage />} />
        <Route
          path="/department-head/assets"
          element={<AssetListPageDepartmentHead />}
        />
        <Route
          path="/department-head/approve-orders"
          element={<DepartmentHeadApproveOrders />}
        />

        {/* Trang Quản Lý */}
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/management/assets" element={<ManageAssets />} />
        <Route
          path="/management/approve-orders"
          element={<ManagementApproveOrders />}
        />
      </Routes>
    </Router>
  );
};

export default App;
