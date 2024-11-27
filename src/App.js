import React from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskListSelector from './components/TaskListSelector';
import Notification from './components/Notification';
import useTasks from './hooks/useTasks';
import useNotification from './hooks/useNotification';
import { ANIMATION_DURATION } from './constants';

function App() {
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
    clearAllTasks 
  } = useTasks();

  const { 
    notification, 
    showNotification, 
    clearNotification 
  } = useNotification();

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

  return (
    <div className="App">
      <Notification 
        message={notification} 
        onClose={clearNotification} 
      />
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
