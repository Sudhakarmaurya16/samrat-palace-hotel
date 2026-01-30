import Booking from "../models/Booking.js";

// =======================
// DUMMY PAYMENT (LOCAL)
// =======================
export const dummyPayment = async (req, res) => {
  const { bookingId, status } = req.body;

  try {
    if (status === "SUCCESS") {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "PAID",
      });

      return res.json({
        success: true,
        message: "Dummy payment successful",
      });
    }

    res.json({
      success: false,
      message: "Dummy payment failed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
