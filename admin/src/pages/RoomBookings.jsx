import React, { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "../services/api";
import "./styles/tableBooking.css"; // Styling reuse kar rahe hain

// ✅ Component Name Changed to RoomBookings
const RoomBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // --- 1. DATA LOAD ---
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBookings();
      // Reverse karke latest booking pehle dikhayein
      setBookings(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. STATUS UPDATE HANDLER ---
  const handleStatusUpdate = async (id, newStatus) => {
    const confirmMessage = `Are you sure you want to mark this booking as ${newStatus}?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      await updateBookingStatus(id, newStatus);
      alert("Status Updated Successfully!");
      loadBookings(); // List refresh karein
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };

  // --- 3. FILTER LOGIC ---
  const filteredBookings =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  // --- 4. COLOR HELPER ---
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#2ecc71"; // Green
      case "CHECKED_IN":
        return "#3498db"; // Blue
      case "PENDING":
        return "#f1c40f"; // Yellow
      case "CANCELLED":
        return "#e74c3c"; // Red
      default:
        return "#aaa";
    }
  };

  return (
    <div className="booking-page-container">
      {/* Header */}
      <div className="page-header">
        <h1>Room Bookings Management</h1>
        <p>View and manage all hotel room reservations</p>
      </div>

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        {["All", "PENDING", "CHECKED_IN", "COMPLETED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "10px 20px",
                background: filter === status ? "#ffc107" : "#1f293a",
                color: filter === status ? "#000" : "#fff",
                border: filter === status ? "none" : "1px solid #333",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9rem",
                transition: "0.3s",
                boxShadow:
                  filter === status
                    ? "0 4px 10px rgba(255, 193, 7, 0.3)"
                    : "none",
              }}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Bookings Table */}
      <div
        className="tables-grid-section"
        style={{
          overflowX: "auto",
          background: "#11141a",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #1f293a",
        }}
      >
        {loading ? (
          <p style={{ color: "white", textAlign: "center", padding: "20px" }}>
            Loading Bookings...
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "#fff",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #333",
                  color: "#aaa",
                  textAlign: "left",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                }}
              >
                <th style={{ padding: "15px" }}>Guest Details</th>
                <th style={{ padding: "15px" }}>Room Info</th>
                <th style={{ padding: "15px" }}>Stay Dates</th>
                <th style={{ padding: "15px" }}>Total Bill</th>
                <th style={{ padding: "15px" }}>Current Status</th>
                <th style={{ padding: "15px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: "1px solid #2a3b4c" }}>
                    {/* Guest Name & Phone */}
                    <td style={{ padding: "15px" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: "#fff",
                        }}
                      >
                        {b.userName}
                      </div>
                      <div
                        style={{
                          color: "#888",
                          fontSize: "0.85rem",
                          marginTop: "4px",
                        }}
                      >
                        📞 {b.phone}
                      </div>
                    </td>

                    {/* Room Title */}
                    <td style={{ padding: "15px" }}>
                      <span
                        style={{
                          background: "#1f293a",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                          border: "1px solid #333",
                        }}
                      >
                        {b.room?.title || "Room " + b.roomNumber}
                      </span>
                    </td>

                    {/* Dates */}
                    <td
                      style={{
                        padding: "15px",
                        fontSize: "0.9rem",
                        color: "#ccc",
                      }}
                    >
                      <div style={{ marginBottom: "4px" }}>
                        📥 <strong>In:</strong>{" "}
                        {new Date(b.checkInDate).toLocaleDateString()}
                      </div>
                      <div>
                        📤 <strong>Out:</strong>{" "}
                        {new Date(b.checkOutDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "15px" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#ffc107",
                          fontSize: "1.1rem",
                        }}
                      >
                        ₹{b.totalAmount}
                      </div>
                      <small style={{ color: "#2ecc71" }}>
                        Paid via Online
                      </small>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: "15px" }}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          border: `1px solid ${getStatusColor(b.status)}`,
                          color: getStatusColor(b.status),
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          background: "rgba(0,0,0,0.2)",
                        }}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Action Dropdown */}
                    <td style={{ padding: "15px" }}>
                      <select
                        style={{
                          background: "#0b0c10",
                          color: "white",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #444",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          outline: "none",
                          width: "100%",
                        }}
                        defaultValue=""
                        onChange={(e) =>
                          handleStatusUpdate(b._id, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Update Status
                        </option>
                        <option value="CHECKED_IN">Guest Check-In</option>
                        <option value="COMPLETED">Check-Out (Finish)</option>
                        <option value="CANCELLED">Cancel Booking</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color: "#666",
                      fontSize: "1.1rem",
                    }}
                  >
                    No bookings found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ✅ Export Name Changed
export default RoomBookings;
