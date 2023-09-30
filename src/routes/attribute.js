import express from "express";
import { createAtribute, getAttributeById, getAttributeBySlug } from "../controller/attribute";
const Router = express.Router();

Router.post("/attributes", createAtribute);
Router.get("/attribute/:id",getAttributeById)
Router.get("/attribute/slug/:slug",getAttributeBySlug)
export default Router;
