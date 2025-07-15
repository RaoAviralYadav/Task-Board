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
    <div className="auth-container fade-in">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <input
            type="text"
            name="username"
            required
            value={form.username}
            onChange={handleChange}
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
          />
          <label>Password</label>
          <span className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit">Login</button>
        {error && <p className="auth-error">{error}</p>}
      </form>

      {showToast && (
        <div className="auth-toast success">
          ✅ Login successful! Redirecting...
        </div>
      )}
    </div>
  );
}

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "./Auth.css";

// function Login() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/board");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>

//         <div className="input-group">
//           <input
//             type="text"
//             name="username"
//             required
//             value={form.username}
//             onChange={handleChange}
//           />
//           <label>Username</label>
//         </div>

//         <div className="input-group">
//           <input
//             type="password"
//             name="password"
//             required
//             value={form.password}
//             onChange={handleChange}
//           />
//           <label>Password</label>
//         </div>

//         <button type="submit">Login</button>
//         {error && <p className="auth-error">{error}</p>}
//       </form>
//     </div>
//   );
// }

// export default Login;
