import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

function useTasks() {
  const [taskLists, setTaskLists] = useLocalStorage(STORAGE_KEYS.TASK_LISTS, []);
  const [activeListId, setActiveListId] = useLocalStorage(STORAGE_KEYS.ACTIVE_LIST, null);

  // Check if list name already exists
  const isListNameDuplicate = (name) => {
    return taskLists.some(list => 
      list.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Add a new task list
  const addTaskList = (name) => {
    const newList = {
      id: Date.now(),
      name: name,
      tasks: []
    };
    setTaskLists([...taskLists, newList]);
    setActiveListId(newList.id);
    return newList;
  };

  // Edit task list name
  const editTaskListName = (listId, newName) => {
    // Check if new name is same as current name
    const currentList = taskLists.find(list => list.id === listId);
    if (currentList.name.toLowerCase() === newName.toLowerCase()) {
      return true; // Allow same name for same list
    }
    
    // Check if name exists in other lists
    const isDuplicate = taskLists.some(list => 
      list.id !== listId && list.name.toLowerCase() === newName.toLowerCase()
    );
    
    if (isDuplicate) {
      return false;
    }

    setTaskLists(taskLists.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    ));
    return true;
  };

  // Delete task list
  const deleteTaskList = (listId) => {
    setTaskLists(taskLists.filter(list => list.id !== listId));
    if (activeListId === listId) {
      setActiveListId(taskLists[0]?.id || null);
    }
  };

  // Get active list
  const activeList = taskLists.find(list => list.id === activeListId);

  // Add task to active list
  const addTask = (taskText) => {
    if (!activeListId) return null;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };

    setTaskLists(taskLists.map(list => 
      list.id === activeListId
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    ));

    return newTask;
  };

  // Check if task already exists in active list
  const isTaskDuplicate = (taskText) => {
    if (!activeList) return false;
    return activeList.tasks.some(task => 
      task.text.toLowerCase() === taskText.toLowerCase()
    );
  };

  // Toggle task in active list
  const toggleTask = (taskId) => {
    if (!activeListId) return;

    setTaskLists(taskLists.map(list => 
      list.id === activeListId
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            )
          }
        : list
    ));
  };

  // Remove task from active list
  const removeTask = (taskId) => {
    if (!activeListId) return;

    setTaskLists(taskLists.map(list => 
      list.id === activeListId
        ? {
            ...list,
            tasks: list.tasks.filter(task => task.id !== taskId)
          }
        : list
    ));
  };

  // Clear all tasks from active list
  const clearAllTasks = () => {
    if (!activeListId) return;

    setTaskLists(taskLists.map(list => 
      list.id === activeListId
        ? { ...list, tasks: [] }
        : list
    ));
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
    isListNameDuplicate,
    toggleTask,
    removeTask,
    clearAllTasks
  };
}

export default useTasks; 