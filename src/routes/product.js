import express from "express";
import { createProduct, deleteProduct, getAllProduct } from "../controller/product";

const Router = express.Router();

Router.get("/products", getAllProduct);
Router.delete("/products/:id", deleteProduct);
Router.post("/products", createProduct)


export default Router