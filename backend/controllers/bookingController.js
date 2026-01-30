import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// =======================
// CREATE BOOKING
// =======================
export const createBooking = async (req, res) => {
  try {
    console.log("New Booking Request:", req.body);

    const {
      room, // Room ID
      userName,
      userPhone,
      checkIn,
      checkOut,
      totalAmount,
      paymentStatus,
      notes,
    } = req.body;

    // 1. Check if Room is already booked for these specific dates
    // (Overlap Logic: New Start < Existing End AND New End > Existing Start)
    const existingBooking = await Booking.findOne({
      room: room,
      status: { $ne: "CANCELLED" }, // Ignore cancelled bookings
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "Room is already booked for these dates. Please choose different dates.",
      });
    }

    // 2. Create Booking Object
    const newBooking = new Booking({
      room,
      userName,
      userPhone,
      checkIn,
      checkOut,
      totalAmount,
      paymentStatus: paymentStatus || "PENDING",
      notes,
    });

    // 3. Save to Database
    const savedBooking = await newBooking.save();

    // ❌ REMOVED: Room Blocking Logic
    // We do NOT set isAvailable: false here, otherwise the room becomes
    // sold out for ALL future dates. Availability is now date-based.

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// =======================
// GET ALL BOOKINGS
// =======================
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET BOOKINGS BY ROOM ID (For "Check Busy Dates")
// =======================
export const getBookingsByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    // Fetch future bookings for this room that are NOT cancelled
    const bookings = await Booking.find({
      room: roomId,
      status: { $ne: "CANCELLED" },
    }).select("checkIn checkOut status"); // Only fetch necessary fields

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    res.status(500).json({ message: "Error fetching room bookings" });
  }
};

// =======================
// UPDATE BOOKING STATUS (Admin)
// =======================
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status }, // Or just 'status' if your schema uses that
      { new: true }
    );
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// =======================
// MARK PAID (Payment)
// =======================
export const markBookingPaid = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is missing" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "PAID" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// =======================
// GET BOOKING BY ID
// =======================
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET USER BOOKINGS (By Phone)
// =======================
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userPhone: req.params.phone,
    })
      .populate("room")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
