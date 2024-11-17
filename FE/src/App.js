import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/Admin/AdminPage";
import EmployeePage from "./components/Employee/EmployeePage";
import AssetListPage from "./components/Employee/AssetListPage";
import OrderManagementPage from "./components/Employee/OrderManagementPage";
import DepartmentHeadPage from "./components/DepartmentHead/DepartmentHeadPage";
import ManagementPage from "./components/Management/ManagementPage"; // Đổi sang ManagementPage
import ManageAssets from "./components/Management/ManageAssets"; // Thêm AddAsset
import ApproveOrders from "./components/Management/ApproveOrders"; // Thêm ApproveOrders

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/employee/assets" element={<AssetListPage />} />
        <Route path="/employee/orders" element={<OrderManagementPage />} />
        <Route path="/department-head" element={<DepartmentHeadPage />} />

        {/* Quản lý tài sản */}
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/management/assets" element={<ManageAssets />} />
        <Route path="/management/approve-orders" element={<ApproveOrders />} />
      </Routes>
    </Router>
  );
};

export default App;
