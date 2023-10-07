import express from "express";
import { deleteVariantProduct, getAllVariantProduct } from "../controller/variant_product";


const Router = express.Router();

Router.get("/variant-product", getAllVariantProduct);
Router.delete("/variant-product/:id", deleteVariantProduct);

export default Router