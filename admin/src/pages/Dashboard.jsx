import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// API functions import karein
import { fetchAllBookings, fetchTableBookings } from "../services/api";
import "./styles/dashboard.css";

function Dashboard() {
  // --- STATE ---
  const [stats, setStats] = useState({
    roomCount: 0,
    tableCount: 0,
    totalRevenue: 0,
    totalAdvance: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- REAL DATA LOADING & CALCULATION ---
  useEffect(() => {
    async function loadRealDashboardData() {
      try {
        // 1. Ek sath dono API calls karein (Parallel Fetching)
        const [roomsData, tablesData] = await Promise.all([
          fetchAllBookings(), // Saari Room Bookings lao
          fetchTableBookings(), // Saari Table Bookings lao
        ]);

        // Safety check: Agar API fail hui ya array nahi aaya to empty array maano
        const rooms = Array.isArray(roomsData) ? roomsData : [];
        const tables = Array.isArray(tablesData) ? tablesData : [];

        // --- 2. CALCULATION LOGIC (Real Math) ---

        // A. Revenue Calculate karein (Room + Table)
        const roomRevenue = rooms.reduce(
          (sum, item) => sum + (Number(item.totalAmount) || 0),
          0
        );
        const tableRevenue = tables.reduce(
          (sum, item) => sum + (Number(item.totalAmount) || 0),
          0
        );

        // B. Advance Calculate karein
        // (Maan lete hain backend se 'advancePaid' field aa raha hai, nahi to 0)
        const roomAdvance = rooms.reduce(
          (sum, item) => sum + (Number(item.advancePaid) || 0),
          0
        );
        const tableAdvance = tables.reduce(
          (sum, item) => sum + (Number(item.advancePaid) || 0),
          0
        );

        // C. State Update karein
        setStats({
          roomCount: rooms.length,
          tableCount: tables.length,
          totalRevenue: roomRevenue + tableRevenue,
          totalAdvance: roomAdvance + tableAdvance,
        });

        // D. Recent Bookings (Top 5 Rooms)
        // Reverse karke latest pehle dikhayein
        setRecentBookings(rooms.slice(-5).reverse());
      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRealDashboardData();
  }, []);

  // Helper for Status Colors
  const getStatusColor = (status) => {
    if (!status) return "status-grey";
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "PAID") return "status-green";
    if (s === "CHECKED_IN" || s === "CONFIRMED") return "status-blue";
    if (s === "PENDING") return "status-orange";
    return "status-grey";
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ color: "white" }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="header-flex">
        <div>
          <h1 className="dashboard-title">Admin Overview</h1>
          <p className="welcome-text">Real-time Data Updates</p>
        </div>
        <p className="date-display">{new Date().toDateString()}</p>
      </div>

      {/* --- SECTION 1: KEY STATS (Real Calculated Data) --- */}
      <div className="stats-grid">
        {/* Card 1: Rooms */}
        <div className="stat-card">
          <div className="icon-box blue-gradient">📅</div>
          <div className="stat-content">
            <h3>{stats.roomCount}</h3>
            <p>Total Room Bookings</p>
          </div>
        </div>

        {/* Card 2: Tables (Real Count) */}
        <div className="stat-card">
          <div className="icon-box orange-gradient">🍽️</div>
          <div className="stat-content">
            <h3>{stats.tableCount}</h3>
            <p>Table Reservations</p>
          </div>
        </div>

        {/* Card 3: Total Revenue (Rooms + Tables) */}
        <div className="stat-card">
          <div className="icon-box green-gradient">₹</div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Business</p>
          </div>
        </div>

        {/* Card 4: Advance Received */}
        <div className="stat-card">
          <div className="icon-box gold-gradient">💼</div>
          <div className="stat-content">
            <h3>₹{stats.totalAdvance.toLocaleString()}</h3>
            <p>Advance Collected</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: RECENT BOOKINGS & ACTIONS --- */}
      <div className="dashboard-content-grid">
        {/* LEFT: RECENT BOOKINGS TABLE */}
        <div className="glass-panel">
          <div className="panel-header">
            <h2>Recent Room Activity</h2>
            <Link to="/admin/bookings" className="view-all-btn">
              View All
            </Link>
          </div>

          <div className="table-responsive">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Room Type</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: "500", color: "#fff" }}>
                        {b.userName || b.name || "Guest"}
                      </td>
                      <td style={{ color: "#aaa" }}>
                        {b.room?.title || b.roomNumber || "Standard"}
                      </td>
                      <td style={{ fontWeight: "bold", color: "#ffc107" }}>
                        ₹{b.totalAmount}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(b.status)}`}
                        >
                          {b.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#666",
                      }}
                    >
                      No bookings found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: QUICK ACTIONS */}
        <div className="glass-panel quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link
              to="/admin/tables"
              className="action-btn"
              style={{ borderLeft: "4px solid #ff9800" }}
            >
              <span className="btn-icon">🍽️</span>
              <div className="btn-text">
                <strong>Manage Tables</strong>
                <small>{stats.tableCount} Reservations So Far</small>
              </div>
            </Link>

            <Link
              to="/admin/room-bookings"
              className="action-btn"
              style={{ borderLeft: "4px solid #2ecc71" }}
            >
              <span className="btn-icon">📅</span>
              <div className="btn-text">
                <strong>Room Bookings</strong>
                <small>{stats.roomCount} Bookings So Far</small>
              </div>
            </Link>

            <Link
              to="/admin/celebrations"
              className="action-btn"
              style={{ borderLeft: "4px solid #e91e63" }}
            >
              <span className="btn-icon">🎉</span>
              <div className="btn-text">
                <strong>Events & Parties</strong>
                <small>Check Requests</small>
              </div>
            </Link>

            <Link
              to="/admin/foods"
              className="action-btn"
              style={{ borderLeft: "4px solid #3498db" }}
            >
              <span className="btn-icon">🍔</span>
              <div className="btn-text">
                <strong>Food Menu</strong>
                <small>Update Prices</small>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
