import express from "express";
import { createProduct, deleteProduct, getAllProduct, getProductByIdAndCount, getProductBySlugAndCount,updateProduct } from "../controller/product";

const Router = express.Router();

Router.get("/products", getAllProduct);
Router.delete("/products/:id", deleteProduct);
Router.post("/products", createProduct);
Router.put("/products/:id", updateProduct);

Router.post("/products", createProduct)
Router.get("/products/:id", getProductByIdAndCount)
Router.get("/products/slug/:slug", getProductBySlugAndCount)

export default Router