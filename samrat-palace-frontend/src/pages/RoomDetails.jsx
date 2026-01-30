import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchRoomById,
  createBooking,
  dummyPay,
  fetchAllFoods,
} from "../services/api";
import "../styles/RoomDetails.css";

// --- Rules Data ---
const RULES = [
  "Check-in time is 12:00 PM and Check-out time is 11:00 AM.",
  "Valid government ID proof is mandatory for all guests upon check-in.",
  "Pets are not allowed on the property premises.",
  "Smoking is strictly prohibited inside the rooms.",
  "Outside food and beverages are not allowed.",
  "Visitors are not allowed in the rooms after 10:00 PM.",
  "Any damage to hotel property will be charged to the guest.",
  "Quiet hours are from 10:00 PM to 7:00 AM.",
];

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [foods, setFoods] = useState([]);

  // User Inputs
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState("");

  // Modal State
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    // 1. Fetch Room Details
    fetchRoomById(id)
      .then(setRoom)
      .catch((err) => console.error(err));

    // 2. Fetch All Foods (Menu)
    fetchAllFoods()
      .then((data) => setFoods(data))
      .catch((err) => console.error("Error loading foods", err));
  }, [id]);

  if (!room)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        Loading Room...
      </h2>
    );

  // ================= CALCULATIONS =================
  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const selectedFoodItem = foods.find((f) => f._id === selectedFoodId);
  const foodPrice = selectedFoodItem ? selectedFoodItem.price : 0;

  const roomCost = nights * room.pricePerNight;
  const totalAmount = roomCost + foodPrice;

  const advancePaid = Math.round(totalAmount * 0.3);
  const remainingAmount = totalAmount - advancePaid;

  // ================= IMAGE HANDLING =================
  const imageUrl =
    room.images && room.images.length > 0
      ? room.images[0]
      : room.image || "https://placehold.co/800x500?text=Room+Image";

  // ================= BOOKING HANDLER =================
  const handleBooking = async () => {
    if (!userName || !userPhone || !checkIn || !checkOut || nights <= 0) {
      alert("Please fill all details correctly");
      return;
    }

    try {
      const bookingPayload = {
        userName,
        userPhone,
        room: room._id,
        checkIn,
        checkOut,
        nights,
        totalAmount,
        advancePaid,
        remainingAmount,
        paymentStatus: "PENDING",
        notes: selectedFoodItem ? `Added Food: ${selectedFoodItem.name}` : "",
      };

      const booking = await createBooking(bookingPayload);

      const confirmPay = window.confirm(`Pay ₹${advancePaid} as 30% advance?`);

      if (confirmPay) {
        await dummyPay(booking._id);

        // ✅ CHANGED: Removed Receipt navigation.
        // Redirecting to My Bookings (Dashboard) instead.
        alert("Booking Successful! You can check your receipt in My Bookings.");
        navigate("/my-bookings");
      } else {
        alert("Booking saved. Payment pending.");
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed. Try again.");
    }
  };

  return (
    <div className="room-page">
      {/* LEFT SIDE: INFO */}
      <div className="room-info">
        {/* BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Rooms
        </button>

        <div className="detail-image-container">
          <img
            src={imageUrl}
            alt={room.title}
            className="detail-room-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/800x500?text=No+Image";
            }}
          />
        </div>

        <h1>{room.title}</h1>
        {room.roomNumber && (
          <span className="room-badge">Room #{room.roomNumber}</span>
        )}
        <p className="room-desc">
          {room.description || "Experience luxury and comfort."}
        </p>

        <div className="amenities">
          {room.fastFoodAvailable && (
            <span
              className="badge"
              style={{ background: "#2ecc71", color: "white" }}
            >
              🍔 Fast Food Available
            </span>
          )}
          <span className="badge">📶 Free Wi-Fi</span>
          <span className="badge">❄️ AC</span>
        </div>

        <h3>
          ₹{room.pricePerNight} <small>/ night</small>
        </h3>

        {/* --- Rules Section --- */}
        <div className="rules-section">
          <h3>House Rules</h3>
          <ul className="rules-list">
            {RULES.slice(0, 3).map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
          <button
            className="view-more-btn"
            onClick={() => setShowRulesModal(true)}
          >
            View More Rules
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: BOOKING FORM */}
      <div className="booking-card">
        <h2>Book This Room</h2>

        <input
          placeholder="Guest Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Phone Number"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />

        <div className="date-row">
          <div>
            <label>Check-In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <label>Check-Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        {/* FAST FOOD DROPDOWN */}
        {room.fastFoodAvailable && (
          <div className="food-selection">
            <label>🍔 Add a Meal (Optional)</label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="food-dropdown"
            >
              <option value="">-- No Meal --</option>
              {foods.map((food) => (
                <option key={food._id} value={food._id}>
                  {food.name} (+ ₹{food.price})
                </option>
              ))}
            </select>
          </div>
        )}

        {nights > 0 && (
          <div className="summary-box">
            <hr />
            <div className="summary-row">
              <span>Room Cost ({nights} nights):</span>
              <span>₹{roomCost}</span>
            </div>

            {selectedFoodItem && (
              <div className="summary-row" style={{ color: "#2ecc71" }}>
                <span>+ {selectedFoodItem.name}:</span>
                <span>₹{foodPrice}</span>
              </div>
            )}

            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row highlight">
              <span>Pay Now (30%):</span>
              <span>₹{advancePaid}</span>
            </div>
            <div className="summary-row">
              <span>Pay at Hotel:</span>
              <span>₹{remainingAmount}</span>
            </div>
          </div>
        )}

        {room.isAvailable === false ? (
          <div className="unavailable-msg">🚫 Currently Unavailable</div>
        ) : (
          <button className="book-btn" onClick={handleBooking}>
            Book Now & Pay ₹{nights > 0 ? advancePaid : "0"}
          </button>
        )}
      </div>

      {/* --- Modal for All Rules --- */}
      {showRulesModal && (
        <div className="modal-overlay" onClick={() => setShowRulesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All House Rules & Regulations</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowRulesModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ul className="full-rules-list">
                {RULES.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                className="modal-action-btn"
                onClick={() => setShowRulesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
