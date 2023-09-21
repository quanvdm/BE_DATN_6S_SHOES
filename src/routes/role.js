import express from "express";
import { createRole } from "../controller/role";

const Router = express.Router();

Router.post("/roles", createRole);

export default Router;
