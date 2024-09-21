import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const TaskSchema = new mongoose.Schema({
    userId: String,
    title: String,
    description: String,
    status: String,
    priority: String,
    dueDate: String,
});

export const User = mongoose.model('User', userSchema);
export const Task = mongoose.model('Task', TaskSchema);
