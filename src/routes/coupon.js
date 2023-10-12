import express from "express"
import { getAllCoupons, removeCoupons,createCoupons } from "../controller/coupon";


const Router = express.Router();

Router.get("/coupons", getAllCoupons);
Router.delete("/coupons/:id", removeCoupons)

Router.post("/coupons",createCoupons)
export default  Router
