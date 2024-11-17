import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../../styles/admin.css"; // Import CSS
import { useNavigate } from "react-router-dom";
function ManageAssets() {
  const [assets, setAssets] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm theo tên tài sản
  const [selectedAssetId, setSelectedAssetId] = useState(null); // ID tài sản được chọn để sửa
  const [message, setMessage] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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
    fetchAllAssets();
  }, []);
  useEffect(() => {
    // Focus vào ô "Tên tài sản" khi form sửa được hiển thị
    if (isEditMode && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditMode]);

  // API: Lấy tất cả tài sản
  const fetchAllAssets = async () => {
    try {
      const response = await fetch("https://localhost:7028/api/Asset");
      if (!response.ok) throw new Error("Không thể tải danh sách tài sản.");
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tải danh sách tài sản.");
    }
  };
  const nameInputRef = useRef(null);

  // API: Tìm kiếm tài sản
  const fetchAssetsBySearchTerm = async () => {
    try {
      const response = await fetch(
        `https://localhost:7028/api/Asset/search?name=${searchTerm}`
      );
      if (!response.ok) throw new Error("Không thể tìm thấy tài sản.");
      const data = await response.json();
      setAssets(data);
      setMessage(`Tìm thấy ${data.length} tài sản.`);
    } catch (error) {
      console.error(error);
      setMessage("Không tìm thấy tài sản.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang đăng nhập
  };
  // API: Thêm tài sản
  const handleAddAsset = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://localhost:7028/api/Asset", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          quantity: parseInt(quantity, 10),
        }),
      });
      if (!response.ok) throw new Error("Không thể thêm tài sản.");
      setMessage("Tài sản đã được thêm thành công.");
      fetchAllAssets();
      resetForm();
      setIsAddMode(false);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi thêm tài sản.");
    }
  };
  const handleBack = () => {
    navigate("/management"); // Điều hướng về EmployeePage
  };
  // API: Sửa tài sản
  const handleUpdateAsset = async (event) => {
    event.preventDefault();
    if (!selectedAssetId) {
      setMessage("Không có tài sản nào được chọn để cập nhật.");
      return;
    }
    try {
      const response = await fetch(
        `https://localhost:7028/api/Asset/${selectedAssetId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: description,
            quantity: parseInt(quantity, 10),
          }),
        }
      );
      if (!response.ok) throw new Error("Không thể cập nhật tài sản.");
      setMessage("Tài sản đã được cập nhật.");
      fetchAllAssets();
      resetForm();
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi cập nhật tài sản.");
    }
  };

  // API: Xóa tài sản
  const handleDeleteAsset = async (id) => {
    try {
      const response = await fetch(`https://localhost:7028/api/Asset/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Không thể xóa tài sản.");
      setMessage("Tài sản đã được xóa.");
      fetchAllAssets();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi xóa tài sản.");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setQuantity(0);
    setSelectedAssetId(null);
    setSearchTerm("");
  };

  return (
    <div className="content-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Trở về
      </button>
      <div className="header">
        <h1>Quản Lý Tài Sản</h1>
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
      {/* Nút hiển thị form thêm */}
      <button
        onClick={() => {
          setIsAddMode(!isAddMode);
          setIsEditMode(false); // Ẩn form sửa nếu đang hiển thị
          resetForm();
        }}
      >
        {isAddMode ? "Đóng" : "Thêm tài sản"}
      </button>

      {/* Thanh tìm kiếm */}
      {!isAddMode && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Nhập tên tài sản để tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchAssetsBySearchTerm} className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      )}

      {/* Form thêm tài sản */}
      {isAddMode && (
        <form onSubmit={handleAddAsset}>
          <h3>Thêm Tài Sản</h3>
          <label>Tên:</label>
          <input
            type="text"
            placeholder="Tên tài sản"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Mô tả:</label>
          <input
            type="text"
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label>Số lượng:</label>
          <input
            type="number"
            placeholder="Số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <button type="submit">Thêm</button>
        </form>
      )}

      {/* Form sửa tài sản */}
      {isEditMode && (
        <form onSubmit={handleUpdateAsset}>
          <h3>Sửa Tài Sản</h3>
          <label>Tên:</label>
          <input
            type="text"
            placeholder="Tên tài sản"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            ref={nameInputRef}
          />
          <label>Mô tả:</label>
          <input
            type="text"
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label>Số lượng:</label>
          <input
            type="number"
            placeholder="Số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <button type="submit">Cập nhật</button>
        </form>
      )}

      {message && <div className="message-box">{message}</div>}

      {/* Danh sách tài sản */}
      <h3>Danh Sách Tài Sản</h3>
      <ul>
        {assets.map((asset) => (
          <ul key={asset.id} className="box-nhanvien">
            <p>ID: {asset.id}</p>
            <p>Tên: {asset.name}</p>
            <p>Mô tả: {asset.description}</p>
            <p>Số lượng: {asset.quantity}</p>
            <button
              onClick={() => {
                setIsEditMode(true); // Hiển thị form sửa
                setIsAddMode(false); // Ẩn form thêm
                setName(asset.name);
                setDescription(asset.description);
                setQuantity(asset.quantity);
                setSelectedAssetId(asset.id); // Lưu ID tài sản
              }}
            >
              Sửa
            </button>
            <button onClick={() => handleDeleteAsset(asset.id)}>Xóa</button>
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default ManageAssets;
