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
import ProductGroupRouter from "./routes/product_group";
import ProductFavoriteRouter from "./routes/product_favorite";
import ProductRouter from "./routes/product"
import VariantProductRouter from "./routes/variant_product"

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
app.use("/api", ProductGroupRouter);
app.use("/api", ProductFavoriteRouter);
app.use("/api", ProductRouter);
app.use("/api", VariantProductRouter);

// connect db
connectDB(process.env.MONGO_URL);

export const viteNodeApp = app;
