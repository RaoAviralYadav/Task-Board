import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Board.css";

function Board() {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1200); // auto open on desktop
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await API.get("/groups");
    setGroups(res.data);
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    const res = await API.post("/groups", { name: newGroupName });
    setGroups([...groups, res.data]);
    setShowModal(false);
    setNewGroupName("");
  };

  return (
    <div className="board-wrapper">
      {/* Sidebar rendered here */}

      {/* Page Content */}
      <div className={`board-page-container ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        {/* Top Header */}
        <div className="board-page-header">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <h2>Your Boards</h2>
          
        </div>

        {/* Group Cards */}
        <div className="board-grid">
          {groups.length === 0 ? (
            <p className="empty-msg">You haven't created any boards yet.</p>
          ) : (
            groups.map((group) => (
              <div
                className="board-card"
                key={group._id}
                onClick={() => navigate(`/board/${group._id}`)}
              >
                <h3>{group.name}</h3>
                <p className="subtext">Click to open</p>
              </div>
            ))
          )}

          <div className="board-card add-card" onClick={() => setShowModal(true)}>
            <div className="add-card-content">
              <span>➕</span>
              <p>Create new board</p>
            </div>
          </div>
        </div>

        {/* Modal for New Group */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Create New Group</h3>
              <input
                type="text"
                placeholder="Board name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <div className="modal-actions">
                <button className="modal-save" onClick={createGroup}>
                  Create
                </button>
                <button className="modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
