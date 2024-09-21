import express from 'express';
import { authenticateJwt } from "../middleware/middleware";
import { Task } from '../db';

const router = express.Router();

router.post('/add', authenticateJwt, (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.headers.userId;

  const newTask = new Task({ title, description,status, priority, userId, dueDate });
  newTask.save()
    .then((savedTask) => {
      res.status(201).json(savedTask);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new Task' });
    });
});

router.get('/', authenticateJwt, (req, res) => {
  const userId = req.headers.userId;

  Task.find({ userId })
    .then((Tasks) => {
      res.json(Tasks);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve Tasks' });
    });
});

router.put('/:TaskId', authenticateJwt, (req, res) => {
  const { TaskId } = req.params;
  const userId = req.headers.userId;

  Task.findOneAndUpdate({ _id: TaskId, userId },  req.body , { new: true })
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update Task' });
    });
});

router.delete('/:TaskId', authenticateJwt, (req, res) => {
  const { TaskId } = req.params;
  const userId = req.headers.userId;
  
  Task.findOneAndDelete({ _id: TaskId })
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(deletedTask);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to detete Task' });
    });
});

export default router
