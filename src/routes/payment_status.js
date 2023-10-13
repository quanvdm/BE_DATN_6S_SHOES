import express from "express"
import { createPaymentStatus } from "../controller/payment_status";


const Router = express.Router();

Router.post("/pStatus", createPaymentStatus)

export default Router