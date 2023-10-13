import express from "express"
import { getAllCoupons, removeCoupons,createCoupons, updateCoupon } from "../controller/coupon";


const Router = express.Router();

Router.get("/coupons", getAllCoupons);
Router.delete("/coupons/:id", removeCoupons)

Router.post("/coupons",createCoupons)
Router.put("/coupons/:id",updateCoupon)
export default  Router
