import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import cookieParser from "cookie-parser" 
import RoleRouter from "./routes/role";
import UserRouter from "./routes/user";
import AuthRouter from "./routes/auth"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
// Router
app.use("/api", RoleRouter);
app.use("/api", UserRouter);
app.use("/api", AuthRouter);
// connect db
connectDB(process.env.MONGO_URL);

export const viteNodeApp = app;
