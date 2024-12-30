import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

function useTasks() {
  const [taskLists, setTaskLists] = useState([]);
  const [activeListId, setActiveListId] = useLocalStorage(STORAGE_KEYS.ACTIVE_LIST, null);

  // Initialize user tasks
  const initializeUserTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks/lists', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const lists = await response.json();
        const listsWithId = lists.map(list => ({
          ...list,
          id: list._id,
          tasks: list.tasks.map(task => ({
            ...task,
            id: task._id
          }))
        }));
        setTaskLists(listsWithId);
        if (listsWithId.length > 0 && !activeListId) {
          setActiveListId(listsWithId[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, [activeListId, setActiveListId]);

  // Check if list name already exists
  const isListNameDuplicate = (name) => {
    return taskLists.some(list => 
      list.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Add a new task list
  const addTaskList = async (name) => {
    try {
      const response = await fetch('/api/tasks/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newList = await response.json();
        setTaskLists([...taskLists, { ...newList, id: newList._id }]);
        setActiveListId(newList._id);
        return newList;
      }
    } catch (err) {
      console.error('Failed to create list:', err);
      return null;
    }
  };

  // Edit task list name
  const editTaskListName = async (listId, newName) => {
    try {
      const response = await fetch(`/api/tasks/lists/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        setTaskLists(taskLists.map(list => 
          list.id === listId ? { ...list, name: newName } : list
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update list:', err);
      return false;
    }
  };

  // Delete task list
  const deleteTaskList = async (listId) => {
    try {
      const response = await fetch(`/api/tasks/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const deletedList = await response.json();
        setTaskLists(taskLists.filter(list => list.id !== listId));
        if (activeListId === listId) {
          const remainingLists = taskLists.filter(list => list.id !== listId);
          setActiveListId(remainingLists[0]?.id || null);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete list:', err);
      return false;
    }
  };

  // Get active list
  const activeList = taskLists.find(list => list.id === activeListId);

  // Add task to active list
  const addTask = async (taskText) => {
    if (!activeListId) return null;

    try {
      const response = await fetch(`/api/tasks/lists/${activeListId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: taskText }),
      });

      if (response.ok) {
        const newTask = await response.json();
        const taskWithId = { ...newTask, id: newTask._id };
        setTaskLists(taskLists.map(list => 
          list.id === activeListId
            ? { ...list, tasks: [...list.tasks, taskWithId] }
            : list
        ));
        return taskWithId;
      }
    } catch (err) {
      console.error('Failed to add task:', err);
      return null;
    }
  };

  // Check if task already exists in active list
  const isTaskDuplicate = (taskText) => {
    if (!activeList) return false;
    return activeList.tasks.some(task => 
      task.text.toLowerCase() === taskText.toLowerCase()
    );
  };

  // Toggle task in active list
  const toggleTask = async (taskId) => {
    if (!activeListId) return;

    try {
      const task = activeList.tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }

      const response = await fetch(`/api/tasks/lists/${activeListId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTaskLists(taskLists.map(list => 
          list.id === activeListId
            ? {
                ...list,
                tasks: list.tasks.map(t =>
                  t.id === taskId
                    ? { ...updatedTask, id: updatedTask._id }
                    : t
                )
              }
            : list
        ));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Remove task from active list
  const removeTask = async (taskId) => {
    if (!activeListId) return;

    try {
      const response = await fetch(`/api/tasks/lists/${activeListId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setTaskLists(taskLists.map(list => 
          list.id === activeListId
            ? {
                ...list,
                tasks: list.tasks.filter(task => task.id !== taskId)
              }
            : list
        ));
      }
    } catch (err) {
      console.error('Failed to remove task:', err);
    }
  };

  // Clear all tasks from active list
  const clearAllTasks = async () => {
    if (!activeListId) return;

    try {
      const response = await fetch(`/api/tasks/lists/${activeListId}/tasks`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setTaskLists(taskLists.map(list => 
          list.id === activeListId
            ? { ...list, tasks: [] }
            : list
        ));
      }
    } catch (err) {
      console.error('Failed to clear tasks:', err);
    }
  };

  return {
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
  };
}

export default useTasks;