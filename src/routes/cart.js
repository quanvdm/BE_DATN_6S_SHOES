import express from "express";
import { addToCart } from "../controller/cart";

const Router = express.Router();
Router.post("/carts", addToCart);

export default Router;
