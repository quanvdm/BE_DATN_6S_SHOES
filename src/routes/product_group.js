import express from "express";

import { createProductGroup, getProductGroupById, getProductGroupBySlug } from "./../controller/product_group";

const Router = express.Router();

Router.post("/product-group", createProductGroup);
Router.get("/product-groups/id/:id", getProductGroupById);
Router.get("/product-groups/slug/:slug", getProductGroupBySlug);

export default Router;
