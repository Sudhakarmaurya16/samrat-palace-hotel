import express from "express";
import { dummyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// DUMMY PAYMENT
router.post("/dummy", dummyPayment);

export default router;
