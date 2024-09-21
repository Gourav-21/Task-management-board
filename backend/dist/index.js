"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./route/auth"));
const task_1 = __importDefault(require("./route/task"));
const cors = require('cors');
require('dotenv').config();
const app = (0, express_1.default)();
const port = 3001;
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
main().catch(err => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.API_KEY === undefined) {
            throw new Error("API_KEY is not defined in the environment variables");
        }
        yield mongoose_1.default.connect(process.env.API_KEY, { dbName: "tasks" });
    });
}
app.use("/auth", auth_1.default);
app.use("/task", task_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
