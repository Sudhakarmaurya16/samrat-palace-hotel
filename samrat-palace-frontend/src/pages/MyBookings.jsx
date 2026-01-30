import { useState } from "react";
import { Link } from "react-router-dom";
// ✅ Import fetchUserTableBookings
import { fetchMyBookings, fetchUserTableBookings } from "../services/api";
import "../styles/myBookings.css";

function MyBookings() {
  const [phone, setPhone] = useState("");

  // Two separate states
  const [roomBookings, setRoomBookings] = useState([]);
  const [tableBookings, setTableBookings] = useState([]);

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) {
      alert("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setSearched(false);
    setRoomBookings([]);
    setTableBookings([]);

    try {
      // ✅ Parallel Fetching: Dono API ek sath call karo
      const [roomsData, tablesData] = await Promise.allSettled([
        fetchMyBookings(phone),
        fetchUserTableBookings(phone),
      ]);

      // Handle Rooms Result
      if (roomsData.status === "fulfilled") {
        setRoomBookings(roomsData.value);
      }

      // Handle Tables Result
      if (tablesData.status === "fulfilled") {
        setTableBookings(tablesData.value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // Status Colors
  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
      case "CONFIRMED":
        return "status-green";
      case "CHECKED_IN":
        return "status-blue";
      case "PENDING":
        return "status-orange";
      case "CANCELLED":
        return "status-red";
      default:
        return "status-grey";
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="booking-container">
        <h1 className="page-title">My Dashboard</h1>
        <p className="subtitle">Track your Stays & Dining reservations</p>

        {/* --- SEARCH BAR --- */}
        <div className="search-wrapper">
          <input
            type="number"
            className="search-input"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Find My Bookings"}
          </button>
        </div>

        {/* --- RESULTS AREA --- */}
        <div className="results-area">
          {/* No Results Case */}
          {searched &&
            roomBookings.length === 0 &&
            tableBookings.length === 0 &&
            !loading && (
              <div className="no-result-card">
                <h3>No Records Found</h3>
                <p>We couldn't find any bookings for {phone}.</p>
              </div>
            )}

          {/* === SECTION 1: ROOM BOOKINGS === */}
          {roomBookings.length > 0 && (
            <div className="section-block">
              <h2 className="section-title">🛏️ Room Stays</h2>
              {roomBookings.map((b) => (
                <div className="user-booking-card room-card-theme" key={b._id}>
                  <div className="card-top">
                    <h3>{b.room?.title || "Luxury Room"}</h3>
                    <span className={`status-pill ${getStatusClass(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="info-group">
                      <label>Check-In</label>{" "}
                      <span>{new Date(b.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="info-group">
                      <label>Check-Out</label>{" "}
                      <span>{new Date(b.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="info-group">
                      <label>Total</label>{" "}
                      <span className="amount">₹{b.totalAmount}</span>
                    </div>
                    <div className="info-group">
                      <label>Due</label>{" "}
                      <span>₹{b.totalAmount - b.advancePaid}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <Link to={`/receipt/${b._id}`} className="receipt-btn">
                      📄 View Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === SECTION 2: TABLE RESERVATIONS (NEW) === */}
          {tableBookings.length > 0 && (
            <div className="section-block">
              <h2 className="section-title">🍽️ Dining Reservations</h2>
              {tableBookings.map((t) => (
                <div className="user-booking-card table-card-theme" key={t._id}>
                  <div className="card-top">
                    <h3>Table for {t.guests}</h3>
                    <span className={`status-pill ${getStatusClass(t.status)}`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="info-group">
                      <label>Date</label> <span>{t.date}</span>
                    </div>
                    <div className="info-group">
                      <label>Time</label> <span>{t.time}</span>
                    </div>
                    <div className="info-group">
                      <label>Food Bill</label>{" "}
                      <span className="amount">₹{t.totalAmount}</span>
                    </div>
                    <div className="info-group">
                      <label>Paid</label>{" "}
                      <span style={{ color: "#2ecc71" }}>₹{t.advancePaid}</span>
                    </div>
                  </div>

                  {/* Food Summary (If Ordered) */}
                  {t.foodItems && Object.keys(t.foodItems).length > 0 && (
                    <div className="mini-food-list">
                      <p>
                        Pre-ordered Items: {Object.keys(t.foodItems).length}
                      </p>
                    </div>
                  )}

                  <div className="card-actions">
                    {/* Future: Add Table Receipt if needed */}
                    <button className="receipt-btn" disabled>
                      Dining Confirmed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
