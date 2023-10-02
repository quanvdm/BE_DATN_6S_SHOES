import express from "express";
import { deleteProduct, getAllProduct } from "../controller/product";

const Router = express.Router();

Router.get("/products", getAllProduct);
Router.delete("/products/:id", deleteProduct);


export default Router