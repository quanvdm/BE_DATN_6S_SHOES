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
import ProductGroupRouter from "./routes/product_group";
import ProductFavoriteRouter from "./routes/product_favorite";
import ProductRouter from "./routes/product";
import VariantProductRouter from "./routes/variant_product";
import ColorRouter from "./routes/color";
import SizeRouter from "./routes/size"
import CouponRouter from "./routes/coupon"
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
app.use("/api", ProductGroupRouter);
app.use("/api", ProductFavoriteRouter);
app.use("/api", ProductRouter);
app.use("/api", VariantProductRouter);
app.use("/api", ColorRouter);
app.use("/api", SizeRouter)
app.use("/api", CouponRouter)
// connect db
connectDB(process.env.MONGO_URL);

export const viteNodeApp = app;
