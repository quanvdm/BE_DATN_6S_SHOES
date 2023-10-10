import express from "express";
import { createVariantProduct, deleteVariantProduct, getAllVariantProduct, updateVariantProduct } from "../controller/variant_product";


const Router = express.Router();

Router.post("/variant-product", createVariantProduct);
Router.get("/variant-product", getAllVariantProduct);
Router.delete("/variant-product/:id", deleteVariantProduct);
Router.put("/variant-product/:id", updateVariantProduct);

export default Router