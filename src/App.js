import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState('');

  const addTask = () => {
    if (task.trim() === '') return;

    const isDuplicate = tasks.some(t => t.text.toLowerCase() === task.toLowerCase());
    if (isDuplicate) {
      if (notification) {
        setNotification('');
        setTimeout(() => {
          setNotification('Task already exists!');
        }, 100);
      } else {
        setNotification('Task already exists!');
      }
      
      setTimeout(() => {
        const notificationElement = document.querySelector('.notification');
        if (notificationElement) {
          notificationElement.classList.add('hiding');
          setTimeout(() => setNotification(''), 500);
        }
      }, 3000);
      return;
    }

    setTasks([...tasks, { text: task, completed: false }]);
    setTask('');
  };

  const toggleTask = (index) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const removeTask = (index) => {
    const taskElement = document.querySelectorAll('.task-item')[index];
    taskElement.classList.add('removing');
    setTimeout(() => {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const closeNotification = () => {
    const notificationElement = document.querySelector('.notification');
    if (notificationElement) {
      notificationElement.classList.add('hiding');
      setTimeout(() => setNotification(''), 500);
    }
  };

  return (
    <div className="App">
      {notification && (
        <div className="notification-container">
          <div className="notification">
            <div className="notification-content">
              <i className="fas fa-exclamation-circle"></i>
              <span>{notification}</span>
            </div>
            <button className="notification-close" onClick={closeNotification}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks
          .sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
          })
          .map((taskItem, index) => (
            <div key={index} className={`task-item ${taskItem.completed ? 'completed' : ''}`}>
              <div className="task-text">{taskItem.text}</div>
              <div className="task-actions">
                <label className="checkbox-container">
                  <input 
                    type="checkbox"
                    checked={taskItem.completed}
                    onChange={() => toggleTask(index)}
                  />
                  <span className="checkmark"></span>
                </label>
                <button className="delete-btn" onClick={() => removeTask(index)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
