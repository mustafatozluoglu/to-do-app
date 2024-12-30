import React, { useState, useEffect } from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskListSelector from './components/TaskListSelector';
import Notification from './components/Notification';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import useTasks from './hooks/useTasks';
import useNotification from './hooks/useNotification';
import { ANIMATION_DURATION } from './constants';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const { 
    taskLists,
    activeList,
    activeListId,
    setActiveListId,
    addTaskList,
    editTaskListName,
    deleteTaskList,
    addTask, 
    isTaskDuplicate,
    toggleTask, 
    removeTask, 
    clearAllTasks,
    initializeUserTasks 
  } = useTasks();

  const { 
    notification, 
    showNotification, 
    clearNotification 
  } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      initializeUserTasks();
    }
  }, [initializeUserTasks]);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    initializeUserTasks();
    showNotification('Welcome back!');
  };

  const handleRegister = (userData) => {
    setIsAuthenticated(true);
    setShowRegister(false);
    showNotification('Registration successful! Welcome!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowProfile(false);
    showNotification('Logged out successfully');
  };

  const handleAddTask = (taskText) => {
    if (!activeList) {
      showNotification('Please create or select a list first!');
      return;
    }

    if (isTaskDuplicate(taskText)) {
      showNotification('Task already exists in this list!');
      return;
    }
    addTask(taskText);
  };

  const handleRemoveTask = (taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      taskElement.classList.add('removing');
      setTimeout(() => removeTask(taskId), ANIMATION_DURATION);
    }
  };

  const handleClearAll = () => {
    const taskList = document.querySelector('.task-list');
    if (taskList) {
      taskList.classList.add('clearing');
      setTimeout(() => {
        clearAllTasks();
        taskList.classList.remove('clearing');
      }, ANIMATION_DURATION);
    }
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  if (showProfile) {
    return <UserProfile 
      onLogout={handleLogout} 
      onBack={() => setShowProfile(false)} 
    />;
  }

  return (
    <div className="App">
      <Notification 
        message={notification} 
        onClose={clearNotification} 
      />
      <div className="app-header">
        <h1>Todo App</h1>
        <button 
          onClick={() => setShowProfile(true)}
          className="profile-button"
        >
          My Profile
        </button>
      </div>
      <div className="app-layout">
        <TaskListSelector
          taskLists={taskLists}
          activeListId={activeListId}
          onSelectList={setActiveListId}
          onAddList={addTaskList}
          onEditList={editTaskListName}
          onDeleteList={deleteTaskList}
        />
        <div className="task-content">
          {activeList && <h2>{activeList.name}</h2>}
          <TaskInput onAddTask={handleAddTask} />
          <TaskList 
            tasks={activeList?.tasks || []}
            onToggleTask={toggleTask}
            onRemoveTask={handleRemoveTask}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
