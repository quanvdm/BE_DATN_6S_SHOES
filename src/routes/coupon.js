import express from "express";
import { createCoupons } from "../controller/coupon";

const Router = express.Router();

Router.post("/coupons",createCoupons)
export default  Router