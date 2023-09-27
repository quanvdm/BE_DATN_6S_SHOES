import express from "express";
import { createCategory } from "../controller/category";

const Router = express.Router();

Router.post("/categories", createCategory);

export default Router;