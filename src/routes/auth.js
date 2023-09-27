import express from "express";
import {
  changePassword,
  requestRefreshToken,
  signin,
  test_token_get_user,
} from "../controller/auth";
import { middlewareController } from "../middleware/authenticate";

const Router = express.Router();

Router.post("/auth/signin", signin);
Router.post("/auth/resfeshtoken", requestRefreshToken);
Router.post("/auth/changePassword", changePassword);
Router.get("/auth/users/:id", middlewareController, test_token_get_user);
export default Router;
