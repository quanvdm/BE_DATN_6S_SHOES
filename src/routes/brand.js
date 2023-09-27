import express from "express";
import { deleteBrand, getAllBrand } from "../controller/brand";
const Router = express.Router();

Router.get("/brands",getAllBrand)
Router.delete("/brands/:id",deleteBrand)
export default Router