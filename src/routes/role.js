import express from "express";
import { createRole, getRoleById, getRoleBySlug } from "../controller/role";

const Router = express.Router();

Router.post("/roles", createRole);
Router.get("/roles/:id",getRoleById);
Router.get("/roles/slug/:slug",getRoleBySlug)
export default Router;
