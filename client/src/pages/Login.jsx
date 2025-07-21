
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setShowToast(true);
      setTimeout(() => {
        navigate("/board");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay" />

      
      <div className="auth-half left">
        <div style={{ color: "white", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>TaskBoard</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
            Welcome back! Visualize your productivity and manage tasks seamlessly.
          </p>
        </div>
      </div>

      
      <div className="auth-half right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in to TaskBoard</h2>
          <p>Manage your tasks efficiently and collaboratively</p>

          <div className="input-group">
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Password</label>
            <span
              className="toggle-pass"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Login</button>
          {error && <p className="auth-error">{error}</p>}

          <div className="alt-option">
            Don’t have an account? <a href="/register">Register here</a>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="auth-toast success">
          ✅ Login successful! Redirecting...
        </div>
      )}
    </div>
  );
}

export default Login;
