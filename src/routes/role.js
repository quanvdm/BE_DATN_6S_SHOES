import express from "express";
import { createRole, getAllRole, getRoleById, getRoleBySlug, removeRole } from "../controller/role";

const Router = express.Router();

Router.post("/roles", createRole);
Router.get("/roles",getAllRole);
Router.get("/roles/:id",getRoleById);
Router.get("/roles/slug/:slug",getRoleBySlug)
Router.delete("/roles/:id", removeRole)
export default Router;
