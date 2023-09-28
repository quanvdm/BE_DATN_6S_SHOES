import express from "express";
import { createCategory, getCategoryById, getCategoryBySlug } from "../controller/category";

const Router = express.Router();

Router.post("/categories", createCategory);
Router.get("/categories/:id",getCategoryById)
Router.get("/categories/slug/:slug",getCategoryBySlug)
export default Router;