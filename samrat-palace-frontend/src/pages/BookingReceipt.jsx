import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBookingById } from "../services/api";
import "../styles/receipt.css"; // ✅ CSS Import zaroori hai

function BookingReceipt() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchBookingById(id)
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Booking Receipt Not Found");
        setLoading(false);
      });
  }, [id]);

  // Helper: Calculate Nights
  const calculateNights = (d1, d2) => {
    const diff = new Date(d2) - new Date(d1);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // 1. Error State
  if (error) {
    return (
      <div className="receipt-error">
        <h2>❌ {error}</h2>
        <Link to="/my-bookings" className="back-btn">
          Go Back
        </Link>
      </div>
    );
  }

  // 2. Loading State
  if (loading) {
    return <div className="receipt-loading">Printing Receipt...</div>;
  }

  // Calculations
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const balance = booking.totalAmount - booking.advancePaid;
  const isPaid = booking.status === "COMPLETED" || booking.status === "PAID";

  return (
    <div className="receipt-page">
      <div className="receipt-wrapper">
        {/* --- THE RECEIPT PAPER --- */}
        <div className="receipt-paper">
          {/* Header */}
          <div className="receipt-header">
            <h2>SAMRAT PALACE</h2>
            <p>Luxury Hotel & Dining</p>
            <p className="address">123, Residency Road, Bengaluru</p>
            <p className="contact">Tel: +91 98765 43210</p>
          </div>

          <div className="dotted-line"></div>

          {/* Guest Info */}
          <div className="receipt-body">
            <div className="row">
              <span>Receipt No:</span>
              <strong>#{booking._id.slice(-6).toUpperCase()}</strong>
            </div>
            <div className="row">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="row">
              <span>Guest:</span>
              <span>{booking.userName}</span>
            </div>
            <div className="row">
              <span>Phone:</span>
              <span>{booking.userPhone}</span>
            </div>
          </div>

          <div className="dotted-line"></div>

          {/* Stay Details */}
          <div className="receipt-body">
            <div className="row">
              <span>Room:</span>
              <span>{booking.room?.title || "Standard Room"}</span>
            </div>
            <div className="row">
              <span>Check-In:</span>
              <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="row">
              <span>Check-Out:</span>
              <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="row">
              <span>Total Nights:</span>
              <span>{nights}</span>
            </div>
          </div>

          <div className="solid-line"></div>

          {/* Payment Details */}
          <div className="receipt-totals">
            <div className="row">
              <span>Total Amount:</span>
              <span>₹{booking.totalAmount}</span>
            </div>
            <div className="row">
              <span>Advance Paid:</span>
              <span>- ₹{booking.advancePaid}</span>
            </div>
            <div className="row grand-total">
              <span>Balance Due:</span>
              <span>₹{balance > 0 ? balance : 0}</span>
            </div>
          </div>

          {/* Stamp Effect */}
          <div className={`stamp ${isPaid ? "is-paid" : "is-due"}`}>
            {isPaid ? "PAID" : "DUE"}
          </div>

          <div className="dotted-line"></div>

          {/* Footer */}
          <div className="receipt-footer">
            <p>Thank you for your visit!</p>
            <p>www.samratpalace.com</p>
            {/* Barcode Mockup */}
            <div className="barcode">|| ||| || |||| ||| || ||</div>
          </div>

          {/* Jagged Edge (CSS Trick) */}
          <div className="jagged-edge"></div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="receipt-actions">
          <button onClick={() => window.print()} className="print-btn">
            🖨️ Print Receipt
          </button>
          <Link to="/my-bookings" className="close-btn">
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingReceipt;
