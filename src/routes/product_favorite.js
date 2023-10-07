import express from "express";
import { addProductToFavorite, getAllFavoriteProducts, getFavoriteProductsByUserId } from "../controller/product_favorite";

const Router = express.Router();

Router.post("/favorites", addProductToFavorite);
Router.get("/favorites", getAllFavoriteProducts);
Router.get("/favorites/:user_id", getFavoriteProductsByUserId);
export default Router;
