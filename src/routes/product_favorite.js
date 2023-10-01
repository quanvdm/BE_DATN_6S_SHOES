import express from "express";
import { addProductToFavorite } from "../controller/product_favorite";

const Router = express.Router();

Router.post("/favorites", addProductToFavorite);
export default Router;
