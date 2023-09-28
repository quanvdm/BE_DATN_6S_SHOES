import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import RoleRouter from "./routes/role";
import UserRouter from "./routes/user";
import AuthRouter from "./routes/auth";
import BrandRouter from "./routes/brand";
import uploadRouter from "./routes/upload";
import CategoryRouter from "./routes/category";
import AttributeRouter from "./routes/attribute";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// Router
app.use("/api", RoleRouter);
app.use("/api", UserRouter);
app.use("/api", AuthRouter);
app.use("/api", BrandRouter);
app.use("/api", uploadRouter);
app.use("/api", CategoryRouter);
app.use("/api", AttributeRouter);

// connect db
connectDB(process.env.MONGO_URL);

export const viteNodeApp = app;
