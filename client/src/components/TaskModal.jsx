
import React, { useState, useEffect } from "react";
import "./TaskModal.css";

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
  }, [task]);

  const handleSave = () => {
    const updated = {
      ...task,
      title,
      description,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="modal-tabs">
          <button
            className={activeTab === "details" ? "active" : ""}
            onClick={() => setActiveTab("details")}
          >
            📝 Details
          </button>
          <button
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            📋 Activity
          </button>
        </div>

        {activeTab === "details" && (
          <div className="modal-body">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className="save-btn" onClick={handleSave}>💾 Save</button>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="modal-activity">
            {task?.activity?.length > 0 ? (
              task.activity.slice(-20).reverse().map((a, i) => (
                <div key={i} className="activity-log">
                  <strong>{a.user}</strong> {a.action}
                  <span>{new Date(a.timestamp).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p>No activity yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskModal;