import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  getCategoryBySlug,
} from "../controller/category";

const Router = express.Router();

Router.post("/categories", createCategory);
Router.put("/categories/:id", updateCategory);

Router.get("/categories/:id", getCategoryById);
Router.get("/categories/slug/:slug", getCategoryBySlug);
Router.get("/categories", getAllCategory);
Router.delete("/categories/:id", deleteCategory);
export default Router;
