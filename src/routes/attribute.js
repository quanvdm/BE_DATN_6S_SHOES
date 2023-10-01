import express from "express";

import {
  createAtribute,
  getAllAttribute,
  removeAttribute,
  getAttributeById, 
  getAttributeBySlug
} from "../controller/attribute";
const Router = express.Router();

Router.get("/attributes", getAllAttribute);
Router.get("/attribute/:id",getAttributeById)
Router.get("/attribute/slug/:slug",getAttributeBySlug)

Router.post("/attributes", createAtribute);

Router.delete("/attributes/:id", removeAttribute);

export default Router;
