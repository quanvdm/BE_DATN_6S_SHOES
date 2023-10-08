import express from "express";
import { createSize, deleteSizeById, deleteSizeBySlug, getAllSizes } from "../controller/size";

const Router = express.Router();

Router.post("/sizes",createSize)
Router.delete("/sizes/:id",deleteSizeById)
Router.delete("/sizes/slug/:slug",deleteSizeBySlug)
Router.get("/sizes",getAllSizes)

export default Router