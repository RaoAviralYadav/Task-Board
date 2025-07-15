import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Welcome to <span className="highlight">TaskBoard</span></h1>
        <p>Organize, Prioritize, and Collaborate in Real-Time</p>
        <div className="btn-group">
          <Link to="/login"><button className="home-btn">Login</button></Link>
          <Link to="/register"><button className="home-btn home-btn-outline">Register</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
