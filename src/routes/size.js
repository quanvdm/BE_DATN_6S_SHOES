import express from "express";
import { createSize, deleteSizeById, deleteSizeBySlug, getAllSizes, getSizeById, getSizeBySlug } from "../controller/size";

const Router = express.Router();

Router.post("/sizes",createSize)
Router.delete("/sizes/:id",deleteSizeById)
Router.delete("/sizes/slug/:slug",deleteSizeBySlug)
Router.get("/sizes",getAllSizes)
Router.get("/sizes/:id",getSizeById)
Router.get("/sizes/slug/:slug",getSizeBySlug)

export default Router