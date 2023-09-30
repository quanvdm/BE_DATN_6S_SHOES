import express from "express";
import {
  createAtribute,
  getAllAttribute,
  removeAttribute,
} from "../controller/attribute";
const Router = express.Router();

Router.get("/attributes", getAllAttribute);

Router.post("/attributes", createAtribute);

Router.delete("/attributes/:id", removeAttribute);

export default Router;
