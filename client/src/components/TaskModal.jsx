import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./TaskModal.css";

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [activeTab, setActiveTab] = useState("details");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?.name || "Unassigned");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setAssignedTo(task?.assignedTo?.name || "Unassigned");
  }, [task]);

  const handleSave = async () => {
    const updated = {
      ...task,
      title,
      description,
      updatedAt: new Date().toISOString(),
    };
    await onSave(updated); // Parent handles PUT + refresh
  };

  const handleSmartAssign = async () => {
    setIsAssigning(true);
    try {
      const res = await API.post(`/tasks/${task._id}/assign-smart`);
      setAssignedTo(res.data.assignedTo?.name || "Assigned");
      console.log("Smart assign result:", res.data);
      alert(`Task assigned to ${res.data.assignedTo?.name || "Unassigned"}`);
      await onSave(res.data); // Refresh modal and board
    } catch (err) {
      alert("Smart assign failed");
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="modal-tabs">
          <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>📝 Details</button>
          <button className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>📋 Activity</button>
        </div>

        {activeTab === "details" && (
          <div className="modal-body">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

            <p><strong>Assigned To:</strong> {assignedTo}</p>
            <button onClick={handleSmartAssign} className="smart-btn" disabled={isAssigning}>
              {isAssigning ? "Assigning..." : "🤖 Smart Assign"}
            </button>

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

// import React, { useState, useEffect } from "react";
// import "./TaskModal.css";

// function TaskModal({ task, onClose, onSave }) {
//   const [title, setTitle] = useState(task?.title || "");
//   const [description, setDescription] = useState(task?.description || "");
//   const [activeTab, setActiveTab] = useState("details");

//   useEffect(() => {
//     setTitle(task?.title || "");
//     setDescription(task?.description || "");
//   }, [task]);

//   const handleSave = () => {
//     const updated = {
//       ...task,
//       title,
//       description,
//       updatedAt: new Date().toISOString(),
//     };
//     onSave(updated);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <button className="close-btn" onClick={onClose}>✖</button>

//         <div className="modal-tabs">
//           <button
//             className={activeTab === "details" ? "active" : ""}
//             onClick={() => setActiveTab("details")}
//           >
//             📝 Details
//           </button>
//           <button
//             className={activeTab === "activity" ? "active" : ""}
//             onClick={() => setActiveTab("activity")}
//           >
//             📋 Activity
//           </button>
//         </div>

//         {activeTab === "details" && (
//           <div className="modal-body">
//             <label>Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             <label>Description</label>
//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <button className="save-btn" onClick={handleSave}>💾 Save</button>
//           </div>
//         )}

//         {activeTab === "activity" && (
//           <div className="modal-activity">
//             {task?.activity?.length > 0 ? (
//               task.activity.slice(-20).reverse().map((a, i) => (
//                 <div key={i} className="activity-log">
//                   <strong>{a.user}</strong> {a.action}
//                   <span>{new Date(a.timestamp).toLocaleString()}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No activity yet.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default TaskModal;