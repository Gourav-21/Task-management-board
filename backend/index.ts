import express from "express";
import mongoose from "mongoose";
import authRouter from "./route/auth";
import taskRouter from "./route/task";
const cors=require('cors')
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}))
app.use(express.json());

main().catch(err => console.log(err));

async function main() {
  if(process.env.API_KEY === undefined){
    throw new Error("API_KEY is not defined in the environment variables");
  }
  await mongoose.connect(process.env.API_KEY, { dbName: "tasks" });
}

app.use("/auth", authRouter);
app.use("/task", taskRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});