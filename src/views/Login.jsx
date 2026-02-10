import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  // 表單資料狀態(儲存登入表單輸入)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 表單輸入處理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData, // 保留原有屬性
      [name]: value, // 更新特定屬性
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      // console.log(response.data)
      const { token, expired } = response.data;
      document.cookie = `gigToken=${token};expires=${new Date(expired)};`; // 設定 Cookie
      axios.defaults.headers.common["Authorization"] = token; // 修改實體建立時所指派的預設配置

      getProducts();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log(error.response?.data);
      alert("登入失敗");
    }
  };

  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
