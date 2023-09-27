import express from "express";
import { createBrand, deleteBrand, getAllBrand } from "../controller/brand";
const Router = express.Router();

Router.get("/brands",getAllBrand)
Router.delete("/brands/:id",deleteBrand)
Router.post("/brands",createBrand)
export default Router