import { useEffect, useState } from "react";
import {
  fetchAllBookings,
  updateBookingStatus,
  fetchTableBookings,
  fetchAllFoods,
  deleteTableBooking,
  fetchCelebrationBookings,
  deleteCelebrationBooking,
} from "../services/api";
import "./styles/bookings.css";

function Bookings() {
  const [roomBookings, setRoomBookings] = useState([]);
  const [tableBookings, setTableBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [menu, setMenu] = useState([]);

  // Load All Data
  const load = async () => {
    try {
      const [rooms, tables, events, foods] = await Promise.all([
        fetchAllBookings(),
        fetchTableBookings(),
        fetchCelebrationBookings(),
        fetchAllFoods(),
      ]);

      // Sort: Newest First
      setRoomBookings(rooms.reverse());
      setTableBookings(tables.reverse());
      setEventBookings(events.reverse());
      setMenu(foods);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Helper: Date Formatter (e.g. 12 Mar 2024)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Check if dateString is a valid date format before converting
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date (might be pre-formatted)

    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-IN", options);
  };

  // Helper: Get Food Name
  const getFoodName = (id) => {
    const food = menu.find((item) => item._id === id);
    return food ? food.name : "Unknown Item";
  };

  // Helper: Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#2ecc71";
      case "CHECKED_IN":
        return "#3498db";
      case "PAID":
        return "#9b59b6";
      case "PENDING":
        return "#e67e22";
      case "CANCELLED":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  // Helper: Event Icon
  const getEventIcon = (type) => {
    if (!type) return "🎉";
    const lowerType = type.toLowerCase();
    if (lowerType.includes("birthday")) return "🎂";
    if (lowerType.includes("engagement")) return "💍";
    if (lowerType.includes("anniversary")) return "🥂";
    if (lowerType.includes("corporate")) return "🤝";
    return "🎉";
  };

  // 1. Handle Room Status
  const handleRoomStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    load();
  };

  // 2. Handle Table Delete
  const handleTableAction = async (id) => {
    if (window.confirm("Is table booking ko remove/complete karein?")) {
      await deleteTableBooking(id);
      load();
    }
  };

  // 3. Handle Event Delete
  const handleEventAction = async (id) => {
    if (window.confirm("Is event request ko delete/complete karein?")) {
      await deleteCelebrationBooking(id);
      load();
    }
  };

  return (
    <div className="bookings-container">
      <h1 className="page-title">Admin Dashboard</h1>

      {/* ==========================
          SECTION 1: ROOM BOOKINGS
      ========================== */}
      <div className="section-header">
        <h2>🏨 Room Bookings</h2>
        <span className="count-badge">{roomBookings.length}</span>
      </div>

      {roomBookings.length === 0 ? (
        <p className="no-data">No room bookings yet.</p>
      ) : (
        <div className="bookings-grid">
          {roomBookings.map((b) => (
            <div className="booking-card room-card" key={b._id}>
              <div className="card-header">
                <h3>{b.room?.title || "Room Booking"}</h3>
                <span className="price-badge">₹{b.totalAmount}</span>
              </div>

              <div className="card-body">
                <p>
                  <strong>Guest:</strong> {b.userName}
                </p>
                <p>
                  <strong>Phone:</strong> {b.userPhone}
                </p>

                {/* ✅ Added Booking Dates Here */}
                <div
                  className="date-info-box"
                  style={{
                    background: "rgba(0,0,0,0.2)", // Darker translucent background
                    padding: "10px",
                    borderRadius: "5px",
                    margin: "10px 0",
                    borderLeft: "3px solid #3498db",
                    fontSize: "0.9rem",
                    color: "#ddd",
                  }}
                >
                  <p style={{ margin: "2px 0" }}>
                    📅 <strong>Check-In:</strong> {formatDate(b.checkIn)}
                  </p>
                  <p style={{ margin: "2px 0" }}>
                    📅 <strong>Check-Out:</strong> {formatDate(b.checkOut)}
                  </p>
                  {/* Calculate Nights */}
                  <p
                    style={{
                      margin: "5px 0 0 0",
                      fontWeight: "bold",
                      color: "#3498db",
                    }}
                  >
                    🌙 Duration:{" "}
                    {b.checkIn && b.checkOut
                      ? Math.max(
                          1,
                          Math.ceil(
                            (new Date(b.checkOut) - new Date(b.checkIn)) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : 0}{" "}
                    Night(s)
                  </p>
                </div>

                {b.notes && <p className="note-text">📝 {b.notes}</p>}
              </div>

              <div className="card-footer">
                <select
                  className="status-dropdown"
                  value={b.paymentStatus || b.status || "PENDING"}
                  style={{
                    borderLeft: `5px solid ${getStatusColor(
                      b.paymentStatus || b.status
                    )}`,
                  }}
                  onChange={(e) => handleRoomStatus(b._id, e.target.value)}
                >
                  <option value="PENDING">⚠️ PENDING</option>
                  <option value="PAID">💰 PAID</option>
                  <option value="CHECKED_IN">🏨 CHECKED IN</option>
                  <option value="COMPLETED">✅ COMPLETED</option>
                  <option value="CANCELLED">❌ CANCELLED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr
        className="section-divider"
        style={{ margin: "40px 0", borderColor: "#444" }}
      />

      {/* ==========================
          SECTION 2: TABLE RESERVATIONS
      ========================== */}
      <div className="section-header">
        <h2>🍽 Table Reservations</h2>
        <span className="count-badge">{tableBookings.length}</span>
      </div>

      {tableBookings.length === 0 ? (
        <p className="no-data">No table reservations found.</p>
      ) : (
        <div className="bookings-grid">
          {tableBookings.map((t) => (
            <div
              className="booking-card table-card"
              key={t._id}
              style={{ borderTop: "4px solid #ff9f43" }}
            >
              <div className="card-header">
                <h3>🍽 {t.name} (Table)</h3>
                <span className="time-badge">{t.time}</span>
              </div>
              <div className="card-body">
                <p>
                  📅 <strong>Date:</strong> {formatDate(t.date)}
                </p>
                <p>
                  📞 <strong>Phone:</strong> {t.phone}
                </p>
                <p>
                  👥 <strong>Guests:</strong> {t.guests}
                </p>
                {t.note && <p className="note-text">📝 {t.note}</p>}

                {t.foodItems && Object.keys(t.foodItems).length > 0 && (
                  <div className="food-list-box">
                    <strong>Pre-Ordered Food:</strong>
                    <ul>
                      {Object.keys(t.foodItems).map((foodId) => (
                        <li key={foodId}>
                          {getFoodName(foodId)} x{t.foodItems[foodId]}
                        </li>
                      ))}
                    </ul>
                    <div className="bill-summary">
                      <span>Total: ₹{t.totalAmount}</span>
                      {t.advancePaid > 0 && (
                        <span className="adv">Adv: ₹{t.advancePaid}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="card-footer">
                <button
                  className="delete-btn"
                  onClick={() => handleTableAction(t._id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Mark Complete / Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr
        className="section-divider"
        style={{ margin: "40px 0", borderColor: "#444" }}
      />

      {/* ==========================
          SECTION 3: EVENT REQUESTS
      ========================== */}
      <div className="section-header">
        <h2>🎉 Event Requests</h2>
        <span
          className="count-badge"
          style={{ background: "#f1c40f", color: "black" }}
        >
          {eventBookings.length}
        </span>
      </div>

      {eventBookings.length === 0 ? (
        <p className="no-data">No event requests yet.</p>
      ) : (
        <div className="bookings-grid">
          {eventBookings.map((e) => (
            <div
              className="booking-card event-card"
              key={e._id}
              style={{ borderTop: "4px solid #f1c40f" }}
            >
              <div className="card-header">
                <h3
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {getEventIcon(e.type)} {e.type?.toUpperCase()}
                </h3>
              </div>
              <div className="card-body">
                {/* ✅ Added Date for Event Requests */}
                <p
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "15px",
                    color: "#f1c40f",
                  }}
                >
                  📅 <strong>Date:</strong> {formatDate(e.date)}
                </p>

                <p>
                  👤 <strong>Name:</strong> {e.name}
                </p>
                <p>
                  📞 <strong>Phone:</strong> {e.phone}
                </p>
                <p>
                  👥 <strong>Guests:</strong> {e.guests}
                </p>
                {e.notes && <p className="note-text">📝 {e.notes}</p>}

                <div
                  style={{
                    marginTop: "15px",
                    padding: "8px",
                    background: "rgba(243, 156, 18, 0.15)",
                    borderRadius: "6px",
                    color: "#f39c12",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  ⚠️ PENDING REQUEST
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="delete-btn"
                  onClick={() => handleEventAction(e._id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#2c3e50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Mark Done / Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
