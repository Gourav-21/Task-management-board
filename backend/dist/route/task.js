"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware/middleware");
const db_1 = require("../db");
const router = express_1.default.Router();
router.post('/add', middleware_1.authenticateJwt, (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.headers.userId;
    const newTask = new db_1.Task({ title, description, status, priority, userId, dueDate });
    newTask.save()
        .then((savedTask) => {
        res.status(201).json(savedTask);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to create a new Task' });
    });
});
router.get('/', middleware_1.authenticateJwt, (req, res) => {
    const userId = req.headers.userId;
    db_1.Task.find({ userId })
        .then((Tasks) => {
        res.json(Tasks);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve Tasks' });
    });
});
router.put('/:TaskId', middleware_1.authenticateJwt, (req, res) => {
    const { TaskId } = req.params;
    const userId = req.headers.userId;
    db_1.Task.findOneAndUpdate({ _id: TaskId, userId }, req.body, { new: true })
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
router.delete('/:TaskId', middleware_1.authenticateJwt, (req, res) => {
    const { TaskId } = req.params;
    const userId = req.headers.userId;
    db_1.Task.findOneAndDelete({ _id: TaskId })
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
exports.default = router;
