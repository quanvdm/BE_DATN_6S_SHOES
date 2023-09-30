import express from "express";

import { createProductGroup } from "./../controller/product_group";

const Router = express.Router();

Router.post("/product-group", createProductGroup);
export default Router;
