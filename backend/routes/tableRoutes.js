import express from "express";
import {
  bookTable,
  getAllTableBookings,
  deleteTableBooking,
  getUserTableBookings, // ✅ Import This
} from "../controllers/tableController.js";

const router = express.Router();

router.post("/", bookTable); // User: Book Table
router.get("/", getAllTableBookings); // Admin: View All
router.get("/user/:phone", getUserTableBookings); // ✅ User: View My Bookings
router.delete("/:id", deleteTableBooking); // Admin: Delete

export default router;
