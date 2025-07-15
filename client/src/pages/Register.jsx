import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    avatar: "",
  });

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
      await API.post("/auth/register", form);
      setShowToast(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container fade-in">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <div className="input-group">
          <input name="name" required value={form.name} onChange={handleChange} />
          <label>Full Name</label>
        </div>

        <div className="input-group">
          <input name="username" required value={form.username} onChange={handleChange} />
          <label>Username</label>
        </div>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <label>Password</label>
          <span className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="input-group">
          <input name="avatar" value={form.avatar} onChange={handleChange} />
          <label>Avatar URL (optional)</label>
        </div>

        <button type="submit">Register</button>
        {error && <p className="auth-error">{error}</p>}
      </form>

      {showToast && (
        <div className="auth-toast success">
          ✅ Registration successful! Redirecting...
        </div>
      )}
    </div>
  );
}

export default Register;
