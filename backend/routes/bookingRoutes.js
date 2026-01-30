import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  markBookingPaid,
  updateBookingStatus,
  getBookingsByRoomId, // ✅ IMPORTED NEW FUNCTION
} from "../controllers/bookingController.js";

const router = express.Router();

// ==========================================
// BOOKING ROUTES
// ==========================================

// 1. Create a new booking
router.post("/", createBooking);

// 2. Get all bookings (For Admin)
router.get("/", getAllBookings);

// 3. Get bookings for a specific Room (For Busy Dates Popup)
// ✅ NEW ROUTE ADDED HERE
router.get("/room/:roomId", getBookingsByRoomId);

// 4. Get bookings for a specific user (by phone)
router.get("/user/:phone", getUserBookings);

// 5. Mark a booking as paid (Dummy Payment)
router.post("/dummy-pay", markBookingPaid);

// 6. Get a specific booking by ID
router.get("/:id", getBookingById);

// 7. Update booking status (Admin)
router.put("/:id/status", updateBookingStatus);

export default router;
