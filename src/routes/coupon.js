import express from "express"
import { getAllCoupons, removeCoupons } from "../controller/coupon";


const Router = express.Router();

Router.get("/coupons", getAllCoupons);
Router.delete("/coupons/:id", removeCoupons)


export default Router