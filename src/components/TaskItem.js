import React from 'react';
import PropTypes from 'prop-types';

function TaskItem({ task, onToggle, onRemove }) {
  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''}`}
      data-task-id={task.id}
    >
      <div className="task-text">
        {task.text}
      </div>
      <div className="task-actions">
        <label className="checkbox-container">
          <input 
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="checkmark"></span>
        </label>
        <button 
          className="delete-btn" 
          onClick={onRemove}
          aria-label={`Delete task "${task.text}"`}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TaskItem; 