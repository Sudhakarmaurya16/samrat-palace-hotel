import Celebration from "../models/Celebration.js";

// 1. Create Booking (User Side)
export const createCelebration = async (req, res) => {
  try {
    const newBooking = new Celebration(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: "Booking Failed", error });
  }
};

// 2. Get All Bookings (Admin Side)
export const getAllCelebrations = async (req, res) => {
  try {
    const bookings = await Celebration.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Fetch Failed", error });
  }
};

// 3. Delete Booking (Admin Side)
export const deleteCelebration = async (req, res) => {
  try {
    await Celebration.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};
