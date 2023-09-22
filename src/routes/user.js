import express from "express";
import { createUserProfile, verifyUser } from "../controller/user";

const Router = express.Router();

Router.post("/users", createUserProfile);

Router.get("/users/verify/:token", verifyUser);
export default Router;
