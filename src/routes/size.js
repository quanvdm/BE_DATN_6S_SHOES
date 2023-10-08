import express from "express";
import { createSize } from "../controller/size";

const Router = express.Router();

Router.post("/sizes",createSize)

export default Router