import Booking from "../models/Booking.js";

export const getAdminStats = async (req, res) => {
  try {
    const bookings = await Booking.find();

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalAdvance = bookings.reduce((sum, b) => sum + b.advancePaid, 0);

    res.json({
      totalBookings,
      totalRevenue,
      totalAdvance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
