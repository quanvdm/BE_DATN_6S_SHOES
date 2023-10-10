import express from "express"
import { createColor,getColorById, getColorBySlug,deleteColorById,deleteColorBySlug,getAllColor } from "../controller/color";


const Router = express.Router();

Router.post("/colors", createColor)
Router.get("/colors/:id", getColorById)
Router.get("/colors/slug/:slug", getColorBySlug)
Router.delete("/colors/:id",deleteColorById)
Router.delete("/colors/slug/:slug",deleteColorBySlug)
Router.get("/colors/",getAllColor)

export default Router