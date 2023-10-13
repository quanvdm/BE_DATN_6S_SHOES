import express from "express";
import { addToCart, getCartByUser } from "../controller/cart";

const Router = express.Router();
Router.get("/carts/:id", getCartByUser);
Router.post("/carts", addToCart);

export default Router;
