import express from "express";
import { createBrand, deleteBrand, getAllBrand, getBrandById, getBrandBySlug } from "../controller/brand";
const Router = express.Router();

Router.get("/brands", getAllBrand);
Router.delete("/brands/:id", deleteBrand);
Router.post("/brands", createBrand);
Router.get("/brands/:id", getBrandById)
Router.get("/brands/slug/:slug", getBrandBySlug)
export default Router;
