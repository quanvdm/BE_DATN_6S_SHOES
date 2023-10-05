import express from "express";
import { createProduct, deleteProduct, getAllProduct, updateProduct, } from "../controller/product";

const Router = express.Router();

Router.get("/products", getAllProduct);
Router.delete("/products/:id", deleteProduct);
Router.post("/products", createProduct);
Router.put("/products/:id", updateProduct);


export default Router