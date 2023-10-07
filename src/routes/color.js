import express from "express"
import { createColor } from "../controller/color";


const Router = express.Router();

Router.post("/colors", createColor)


export default Router