import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const initials = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <div className={`sidebar ${isOpen ? 'show' : 'hide'}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={toggleSidebar}>✕</button>
        </div>

        <div className="sidebar-top">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="avatar" />
          ) : (
            <div className="avatar-placeholder">{initials}</div>
          )}
          <p>{user?.name}</p>
        </div>

        <div className="sidebar-links">
          <p>🏠 My Boards</p>
          <p>📊 Analytics</p>
          <p>⚙️ Settings</p>
        </div>
      </div>

      {isOpen && window.innerWidth < 1200 && (
        <div className="sidebar-backdrop" onClick={toggleSidebar}></div>
      )}
    </>
  );
}

export default Sidebar;

