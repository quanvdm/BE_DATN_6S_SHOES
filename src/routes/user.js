import express from "express";
import {
  banUser,
  createUserProfile,
  deleteUser,
  deleteUserBySlug,
  getAllUsers,
  getUserById,
  getUserBySlug,
  verifyUser,
  updateUserProfile
} from "../controller/user";
import { verifyUserController } from "../middleware/authenticate";

const Router = express.Router();

Router.post("/users", createUserProfile);

Router.get("/users", getAllUsers);
Router.get("/users/:id", getUserById);
Router.get("/user/:slug", getUserBySlug);

Router.put("/users/ban/:id", banUser);
Router.get("/users/verify/:token", verifyUser);
Router.delete("/users/:id", verifyUserController, deleteUser);
Router.delete("/users/delete/slug/:slug", deleteUserBySlug);
Router.put("/users/:id", updateUserProfile);

export default Router;
