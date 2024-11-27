import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleTask, onRemoveTask, onClearAll }) {
  // Sort tasks: incomplete tasks first, then completed tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-state-content">
          <i className="fas fa-clipboard-list empty-icon"></i>
          <h2>No Tasks Yet</h2>
          <p>Your task list is empty. Add your first task to get started!</p>
          <div className="empty-state-tips">
            <h3>Quick Tips:</h3>
            <ul>
              <li>Type your task in the input field above</li>
              <li>Press Enter or click "Add" to create a task</li>
              <li>Use the checkbox to mark tasks as complete</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onRemove={() => onRemoveTask(task.id)}
          />
        ))}
      </div>
      <button 
        className="clear-all-btn"
        onClick={onClearAll}
        aria-label="Clear all tasks"
      >
        Clear All Tasks
      </button>
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onRemoveTask: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired
};

export default TaskList; 