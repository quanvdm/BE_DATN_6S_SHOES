import express from "express";
import {
  changePassword,
  forgetPassword,
  requestRefreshToken,
  resetPassWord,
  signin,
  test_token_get_user,
  verifyToken,
} from "../controller/auth";
import { middlewareController } from "../middleware/authenticate";

const Router = express.Router();

Router.post("/auth/signin", signin);
Router.post("/auth/resfeshtoken", requestRefreshToken);
Router.post("/auth/changePassword", changePassword);
Router.post("/auth/forgetPassword", forgetPassword);
Router.post("/auth/verifyToken", verifyToken);
Router.post("/auth/resetPassword", resetPassWord);
Router.get("/auth/users/:id", middlewareController, test_token_get_user);
export default Router;
