"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const TaskSchema = new mongoose_1.default.Schema({
    userId: String,
    title: String,
    description: String,
    status: String,
    priority: String,
    dueDate: String,
});
exports.User = mongoose_1.default.model('User', userSchema);
exports.Task = mongoose_1.default.model('Task', TaskSchema);
