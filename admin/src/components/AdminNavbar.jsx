import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminNavbar.css"; // CSS file import zaroori hai

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Confirmation (Optional but recommended)
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      navigate("/");
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="nav-brand">
        {/* Logo text updated to match CSS styling hook */}
        <h2 className="logo">Samrat Admin</h2>
      </div>

      <div className="nav-links">
        <Link to="/dashboard" className="nav-item">
          Dashboard
        </Link>
        <Link to="/rooms" className="nav-item">
          Rooms
        </Link>
        <Link to="/admin/foods" className="nav-item">
          Dining
        </Link>
        <Link to="/admin/table-bookings" className="nav-item">
          Table Reservations
        </Link>
        <Link to="/admin/celebrations" className="nav-item">
          Events
        </Link>
        <Link to="/bookings" className="nav-item">
          Bookings
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
