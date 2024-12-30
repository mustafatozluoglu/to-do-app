const express = require('express');
const auth = require('../middleware/auth');
const TaskList = require('../models/TaskList');
const router = express.Router();

// Get all task lists
router.get('/lists', auth, async (req, res) => {
  try {
    const taskLists = await TaskList.find({ user: req.user._id });
    res.json(taskLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lists' });
  }
});

// Create new task list
router.post('/lists', auth, async (req, res) => {
  try {
    const taskList = new TaskList({
      ...req.body,
      user: req.user._id
    });
    await taskList.save();
    res.status(201).json(taskList);
  } catch (error) {
    res.status(400).json({ message: 'Error creating list' });
  }
});

// Update task list
router.put('/lists/:id', auth, async (req, res) => {
  try {
    const taskList = await TaskList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!taskList) {
      return res.status(404).json({ message: 'List not found' });
    }

    taskList.name = req.body.name;
    await taskList.save();
    res.json(taskList);
  } catch (error) {
    res.status(400).json({ message: 'Error updating list' });
  }
});

// Delete task list
router.delete('/lists/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete list with ID:', req.params.id);
    console.log('User ID:', req.user._id);
    
    const taskList = await TaskList.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!taskList) {
      console.log('List not found');
      return res.status(404).json({ message: 'List not found' });
    }

    console.log('List deleted successfully:', taskList);
    res.json(taskList);
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Error deleting list' });
  }
});

// Add task to list
router.post('/lists/:id/tasks', auth, async (req, res) => {
  try {
    const taskList = await TaskList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!taskList) {
      return res.status(404).json({ message: 'List not found' });
    }

    taskList.tasks.push({ text: req.body.text });
    await taskList.save();
    const newTask = taskList.tasks[taskList.tasks.length - 1];
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error adding task' });
  }
});

// Update task in list
router.put('/lists/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const taskList = await TaskList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!taskList) {
      return res.status(404).json({ message: 'List not found' });
    }

    const task = taskList.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = req.body.completed;
    await taskList.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

// Delete task from list
router.delete('/lists/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const taskList = await TaskList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!taskList) {
      return res.status(404).json({ message: 'List not found' });
    }

    taskList.tasks = taskList.tasks.filter(
      task => task._id.toString() !== req.params.taskId
    );
    await taskList.save();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Clear all tasks from list
router.delete('/lists/:id/tasks', auth, async (req, res) => {
  try {
    const taskList = await TaskList.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!taskList) {
      return res.status(404).json({ message: 'List not found' });
    }

    taskList.tasks = [];
    await taskList.save();
    res.json({ message: 'All tasks cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing tasks' });
  }
});

module.exports = router;
