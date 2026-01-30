import TableBooking from "../models/TableBooking.js";

// 1. Create New Table Booking (User Side)
export const bookTable = async (req, res) => {
  try {
    const newBooking = new TableBooking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: "Booking Failed", error });
  }
};

// 2. Get All Table Bookings (Admin Side)
export const getAllTableBookings = async (req, res) => {
  try {
    const bookings = await TableBooking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Fetch Failed", error });
  }
};

// 3. Get User Table Bookings (By Phone) - ✅ NEW ADDED
export const getUserTableBookings = async (req, res) => {
  try {
    const { phone } = req.params;
    const bookings = await TableBooking.find({ phone }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};

// 4. Delete Booking (Admin Side)
export const deleteTableBooking = async (req, res) => {
  try {
    await TableBooking.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};
