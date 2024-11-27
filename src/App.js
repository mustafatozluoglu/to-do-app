import React from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Notification from './components/Notification';
import useTasks from './hooks/useTasks';
import useNotification from './hooks/useNotification';
import { ANIMATION_DURATION } from './constants';

function App() {
  const { 
    tasks, 
    addTask, 
    isTaskDuplicate,
    toggleTask, 
    removeTask, 
    clearAllTasks 
  } = useTasks();

  const { 
    notification, 
    showNotification, 
    clearNotification 
  } = useNotification();

  // Handle adding new task
  const handleAddTask = (taskText) => {
    if (isTaskDuplicate(taskText)) {
      showNotification('Task already exists!');
      return;
    }
    addTask(taskText);
  };

  // Handle removing task with animation
  const handleRemoveTask = (taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      taskElement.classList.add('removing');
      setTimeout(() => removeTask(taskId), ANIMATION_DURATION);
    }
  };

  // Handle clearing all tasks with animation
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

  return (
    <div className="App">
      <Notification 
        message={notification} 
        onClose={clearNotification} 
      />
      <TaskInput onAddTask={handleAddTask} />
      <TaskList 
        tasks={tasks}
        onToggleTask={toggleTask}
        onRemoveTask={handleRemoveTask}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;
