import express from "express";
import {
  banUser,
  createUserProfile,
  getAllUsers,
  verifyUser,
} from "../controller/user";

const Router = express.Router();

Router.post("/users", createUserProfile);
Router.get("/users", getAllUsers);
Router.post("/users/ban/:id", banUser);
Router.get("/users/verify/:token", verifyUser);
export default Router;
