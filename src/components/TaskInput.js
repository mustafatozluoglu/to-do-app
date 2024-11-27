import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TaskInput({ onAddTask }) {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = () => {
    const trimmedText = taskText.trim();
    if (trimmedText) {
      onAddTask(trimmedText);
      setTaskText('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task"
        aria-label="New task input"
      />
      <button 
        onClick={handleSubmit}
        aria-label="Add task"
      >
        Add
      </button>
    </div>
  );
}

TaskInput.propTypes = {
  onAddTask: PropTypes.func.isRequired
};

export default TaskInput; 