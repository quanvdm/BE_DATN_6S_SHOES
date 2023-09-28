import express from "express";
import { createAtribute } from "../controller/attribute";
const Router = express.Router();

Router.post("/attributes", createAtribute);

export default Router;
