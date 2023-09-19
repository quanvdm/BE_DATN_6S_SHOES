import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// connect db
connectDB(process.env.MONGO_URL);

export const viteNodeApp = app;
