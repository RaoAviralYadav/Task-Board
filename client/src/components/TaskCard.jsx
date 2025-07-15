import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function TaskCard({ task, index }) {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
