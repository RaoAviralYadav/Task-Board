
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // or your deployed URL
});

// 🛡️ Add token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export default API;

