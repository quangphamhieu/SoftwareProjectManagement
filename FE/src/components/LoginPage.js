// src/components/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode (lưu ý không cần destructure)
import { login } from "../api/auth"; // API gọi đến backend
import "../styles/LoginPage.css"; // Import CSS

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error trước khi gửi request

    try {
      // Gửi request đến API đăng nhập
      const data = await login(email, password);

      // Lấy token từ response
      const token = data.accessToken;
      if (!token) {
        throw new Error("Không nhận được token từ server.");
      }

      // Lưu token vào localStorage
      localStorage.setItem("accessToken", token);

      // Giải mã token để lấy role
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userId = decoded.id; // Lấy userId từ token nếu cần

      console.log("Role:", role); // Debug role
      console.log("User ID:", userId); // Debug userId

      // Lưu userId vào localStorage nếu cần
      localStorage.setItem("userId", userId);

      // Điều hướng dựa trên role
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Nhân Viên":
          navigate("/employee");
          break;
        case "Trưởng Bộ Phận":
          navigate("/department-head");
          break;
        case "Bộ Phận Quản Lý":
          navigate("/management");
          break;
        default:
          throw new Error("Quyền truy cập không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.message || err);
      setError(
        err.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Đăng Nhập
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
