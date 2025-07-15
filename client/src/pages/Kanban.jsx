import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import "./Kanban.css";
import StrictModeDroppable from "../components/StrictModeDroppable";
import TaskModal from "../components/TaskModal";


export default function Kanban() {
  const [selectedTask, setSelectedTask] = useState(null);
  const { groupId } = useParams();

  // Default statuses
  const defaultStatuses = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  const [statuses, setStatuses] = useState(defaultStatuses);
  const [columns, setColumns] = useState(() =>
    defaultStatuses.reduce((acc, s) => {
      acc[s.id] = [];
      return acc;
    }, {})
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newListName, setNewListName] = useState("");

  // Fetch tasks when groupId/statuses change
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await API.get(`/tasks/group/${groupId}`);
      const base = {};
      statuses.forEach((s) => {
        base[s.id] = [];
      });
      res.data.forEach((task) => {
        // Only use tasks that match current statuses
        if (statuses.find((s) => s.id === task.status)) {
          base[task.status].push(task);
        }
      });
      setColumns(base);
    };

    fetchTasks();
  }, [groupId, statuses]);

  // 🗑️ Delete column handler
  const deleteColumn = (columnId) => {
    // Optional: prevent deleting default columns

    setStatuses((prev) => prev.filter((s) => s.id !== columnId));
    setColumns((prev) => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  };

  // Drag & Drop Handler
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Avoid unnecessary updates if dropped in same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = [...columns[source.droppableId]];
    const destColumn = [...columns[destination.droppableId]];
    const movedTask = sourceColumn[source.index];

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(source.index, 1);
      sourceColumn.splice(destination.index, 0, movedTask);

      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
      }));
    } else {
      // Moving to a different column
      const updatedTask = { ...movedTask, status: destination.droppableId };
      sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, updatedTask);

      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      }));

      try {
        await API.put(`/tasks/${updatedTask._id}`, { status: updatedTask.status });
      } catch (err) {
        console.error("Failed to update task status", err);
      }
    }
  };

  // Create a new task
  const createTask = async (status) => {
    if (!newTaskTitle.trim()) return;
    const task = { title: newTaskTitle, status, groupId, priority: "medium" };
    try {
      const res = await API.post("/tasks", task);
      setColumns((prev) => ({
        ...prev,
        [status]: [...prev[status], res.data],
      }));
      setNewTaskTitle("");
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  // Add a new column/list
  const addList = () => {
    const name = newListName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    if (statuses.some((s) => s.id === id)) return; // Avoid duplicates

    setStatuses((prev) => [...prev, { id, title: name }]);
    setColumns((prev) => ({ ...prev, [id]: [] }));
    setNewListName("");
  };

  return (
    <div className="kanban-page">
      <header className="kanban-header">
        <h2>My Board</h2>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-columns">
          {statuses.map(({ id, title }) => (
            <StrictModeDroppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* ⬇️ Header with delete button */}
                  <div className="kanban-column-header">
                    <h3>{title}</h3>
                    <button
                      className="delete-column-btn"
                      onClick={() => deleteColumn(id)}
                      title="Delete Column"
                    >
                      🗑️
                    </button>
                  </div>

                  {columns[id]?.map((task, idx) => (
                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                      {(prov) => (
                        <div
                          className="kanban-card"
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          onClick={() => setSelectedTask(task)} // ← SHOW MODAL
                        >
                          {task.title}
                        </div>

                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Add card input */}
                  <div className="add-task-box">
                    <input
                      type="text"
                      placeholder="Add a card"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createTask(id)}
                    />
                  </div>
                </div>
              )}
            </StrictModeDroppable>
          ))}

          {/* Add new list */}
          <div className="add-list-column">
            <input
              type="text"
              placeholder="Add a list"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addList()}
            />
            <button onClick={addList}>➕ Add List</button>
          </div>
        </div>
      </DragDropContext>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={async (updatedTask) => {
            try {
              const res = await API.put(`/tasks/${updatedTask._id}`, updatedTask);
              setColumns((prev) => {
                const newCols = { ...prev };
                const list = [...newCols[updatedTask.status]];
                const idx = list.findIndex((t) => t._id === updatedTask._id);
                if (idx !== -1) list[idx] = res.data;
                newCols[updatedTask.status] = list;
                return newCols;
              });
              setSelectedTask(null);
            } catch (err) {
              console.error("Failed to update task", err);
            }
          }}
        />
      )}

    </div>
  );
}
