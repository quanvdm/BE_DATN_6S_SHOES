import express from "express";
import {
  changePassword,
  forgetPassword,
  register,
  requestRefreshToken,
  resetPassWord,
  signin,
  test_token_get_user,
  verifyToken,
} from "../controller/auth";
import { middlewareController } from "../middleware/authenticate";

const Router = express.Router();

Router.post("/auth/signin", signin);
Router.post("/auth/signup", register);

Router.post("/auth/change-password", changePassword);
Router.post("/auth/forget-password", forgetPassword);
Router.post("/auth/verify-email", verifyToken);
Router.post("/auth/reset-password", resetPassWord);

Router.post("/auth/resfeshtoken", requestRefreshToken);
Router.get("/auth/users/:id", middlewareController, test_token_get_user);
export default Router;
