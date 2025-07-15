import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const columnNames = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

function BoardColumn({ status, tasks }) {
  return (
    <div className="board-column">
      <h3>{columnNames[status]}</h3>
      <Droppable droppableId={status}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />

            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default BoardColumn;
