import express from "express";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();

// =======================
// 1. LOGIN ROUTE
// =======================
router.post("/login", adminLogin);

// =======================
// 2. STATS ROUTE (Dashboard ke liye)
// =======================
// Filhal hum dummy data bhej rahe hain taaki Dashboard crash na ho.
// Baad mein aap isse database se connect kar sakte hain.
router.get("/stats", (req, res) => {
  res.status(200).json({
    totalBookings: 12, // Example Data
    totalRevenue: 45000, // Example Data
    totalAdvance: 15000, // Example Data
  });
});

export default router;
