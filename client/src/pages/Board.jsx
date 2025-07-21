
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
    try {
      const res = await API.get("/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await API.post("/groups", { name: newGroupName });
      setGroups([...groups, res.data]);
      setShowModal(false);
      setNewGroupName("");
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  const deleteGroup = async (groupId) => {
    const confirm = window.confirm("Are you sure you want to delete this board?");
    if (!confirm) return;

    try {
      await API.delete(`/groups/${groupId}`);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      console.error("Failed to delete group", err);
    }
  };

  return (
    <div className="board-wrapper">
      <div className={`board-page-container ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <div className="board-page-header">
          <h2>Your Boards</h2>
        </div>

        <div className="board-grid">
          {groups.length === 0 ? (
            <p className="empty-msg">You haven't created any boards yet.</p>
          ) : (
            groups.map((group) => (
              <div
                className="board-card board-hover"
                key={group._id}
              >
                <div
                  onClick={() => navigate(`/board/${group._id}`)}
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  <h3>{group.name}</h3>
                  <p className="subtext">Click to open</p>
                </div>
                <button
                  className="delete-group-btn"
                  onClick={() => deleteGroup(group._id)}
                  title="Delete Board"
                >
                  🗑️
                </button>
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
                <button className="modal-save" onClick={createGroup}>Create</button>
                <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
