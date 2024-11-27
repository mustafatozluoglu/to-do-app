import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

function useTasks() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);

  // Add a new task
  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  // Check if task already exists
  const isTaskDuplicate = (taskText) => {
    return tasks.some(task => 
      task.text.toLowerCase() === taskText.toLowerCase()
    );
  };

  // Toggle task completion status
  const toggleTask = (taskId) => {
    setTasks(tasks.map((task) => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  // Remove a specific task
  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
  };

  return {
    tasks,
    addTask,
    isTaskDuplicate,
    toggleTask,
    removeTask,
    clearAllTasks
  };
}

export default useTasks; 