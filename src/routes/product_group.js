import express from "express";

import { createProductGroup, deleteProductGroup, getAllProductGroup,getProductGroupById, getProductGroupBySlug, updateGroup } from "./../controller/product_group";

const Router = express.Router();

Router.post("/product-group", createProductGroup);
Router.get("/product-group", getAllProductGroup);
Router.delete("/product-group/:id", deleteProductGroup);
Router.put("/product-group/:id", updateGroup)
Router.get("/product-groups/id/:id", getProductGroupById);
Router.get("/product-groups/slug/:slug", getProductGroupBySlug);

export default Router;
