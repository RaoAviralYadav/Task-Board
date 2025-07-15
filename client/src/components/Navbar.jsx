import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">Task<span>Board</span></Link>
      </div>
      <div className="nav-right">
        <Link className="nav-item" to="/">Home</Link>
        <Link className="nav-item" to="/services">Services</Link>
        <Link className="nav-item" to="/contact">Contact</Link>
        <Link to="/login"><button className="nav-btn">Login</button></Link>
        <Link to="/register"><button className="nav-btn nav-btn-outline">Register</button></Link>
      </div>
    </nav>
  );
}

export default Navbar;
