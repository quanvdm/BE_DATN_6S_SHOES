import express from "express"
import { createColor,getColorById, getColorBySlug } from "../controller/color";


const Router = express.Router();

Router.post("/colors", createColor)
Router.get("/colors/:id", getColorById)
Router.get("/colors/slug/:slug", getColorBySlug)

export default Router