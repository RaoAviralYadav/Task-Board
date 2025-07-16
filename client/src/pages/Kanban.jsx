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

  const [newTaskTitles, setNewTaskTitles] = useState({});
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await API.get(`/tasks/group/${groupId}`);
      const base = {};
      statuses.forEach((s) => {
        base[s.id] = [];
      });
      res.data.forEach((task) => {
        if (statuses.find((s) => s.id === task.status)) {
          base[task.status].push(task);
        }
      });
      setColumns(base);
    };

    fetchTasks();
  }, [groupId, statuses]);

  const deleteColumn = (columnId) => {
    setStatuses((prev) => prev.filter((s) => s.id !== columnId));
    setColumns((prev) => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceColumn = [...columns[source.droppableId]];
    const destColumn = [...columns[destination.droppableId]];
    const movedTask = sourceColumn[source.index];

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(source.index, 1);
      sourceColumn.splice(destination.index, 0, movedTask);
      setColumns((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
      }));
    } else {
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

  const createTask = async (status) => {
    const title = (newTaskTitles[status] || "").trim();
    if (!title) return;

    // 🚫 Validate against column titles (user-facing), not just IDs
    const forbiddenTitles = statuses.map(s => s.title.toLowerCase());
    if (forbiddenTitles.includes(title.toLowerCase())) {
      alert("⚠️ Task title cannot match a column name.");
      return;
    }

    const task = { title, status, groupId, priority: "medium" };

    try {
      const res = await API.post("/tasks", task);
      setColumns((prev) => ({
        ...prev,
        [status]: [...prev[status], res.data],
      }));
      setNewTaskTitles((prev) => ({ ...prev, [status]: "" }));
    } catch (err) {
      if (err.response?.status === 409) {
        alert("⚠️ A task with this title already exists in this group.");
      } else {
        alert("Failed to create task.");
      }
    }
  };


  const addList = () => {
    const name = newListName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    if (statuses.some((s) => s.id === id)) return;

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
                          onClick={() => setSelectedTask(task)}
                        >
                          {task.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <div className="add-task-box">
                    <input
                      type="text"
                      placeholder="Add a card"
                      value={newTaskTitles[id] || ""}
                      onChange={(e) =>
                        setNewTaskTitles((prev) => ({
                          ...prev,
                          [id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && createTask(id)}
                    />
                  </div>
                </div>
              )}
            </StrictModeDroppable>
          ))}

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
