import PDFDocument from "pdfkit";
import Booking from "../models/Booking.js";

export const generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");

    if (!booking || !booking.room) {
      return res.status(404).json({ message: "Booking or Room not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${booking._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("Samrat Palace Hotel", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Invoice ID: ${booking._id}`);
    doc.text(`Guest Name: ${booking.userName}`);
    doc.text(`Phone: ${booking.userPhone}`);
    doc.moveDown();

    doc.text(`Room: ${booking.room.title}`);
    doc.text(
      `Stay: ${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}`
    );
    doc.text(`Nights: ${booking.nights}`);
    doc.moveDown();

    doc.text(`Total Amount: ₹${booking.totalAmount}`);
    doc.text(`Advance Paid: ₹${booking.advancePaid}`);
    doc.text(`Remaining: ₹${booking.remainingAmount}`);
    doc.moveDown();

    doc.text(`Payment Status: ${booking.paymentStatus}`);
    doc.moveDown(2);

    doc.text("Thank you for choosing Samrat Palace!", { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
