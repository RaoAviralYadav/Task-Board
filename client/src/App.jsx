import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Board from "./pages/Board.jsx"; 
import Home from "./pages/Home.jsx";
import './App.css';
import Kanban from './pages/Kanban';
import { ToastProvider } from "./components/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:groupId" element={<Kanban />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
