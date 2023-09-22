import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";

import RoleRouter from "./routes/role";
import UserRouter from "./routes/user";

dotenv.config();

const app = express();
app.use(express.json());

// Router
app.use("/api", RoleRouter);
app.use("/api", UserRouter);

// connect db
connectDB(process.env.MONGO_URL);

export const viteNodeApp = app;
