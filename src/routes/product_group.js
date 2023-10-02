import express from "express";

import { createProductGroup, deleteProductGroup, getAllProductGroup } from "./../controller/product_group";

const Router = express.Router();

Router.post("/product-group", createProductGroup);
Router.get("/product-group", getAllProductGroup);
Router.delete("/product-group/:id", deleteProductGroup);


export default Router;
