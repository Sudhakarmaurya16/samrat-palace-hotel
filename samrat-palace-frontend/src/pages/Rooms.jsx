import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/rooms.css";
// ✅ IMPORT FIXED: Naya function import kiya
import { fetchAllRooms, fetchBookingsByRoomId } from "../services/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [selectedRoomBookings, setSelectedRoomBookings] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [modalLoading, setModalLoading] = useState(false); // ✅ Loader for popup

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    fetchAllRooms()
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // --- 🔥 FIX: Click karne par Server se Data Lao ---
  const openBookingModal = async (e, room) => {
    e.preventDefault();
    setSelectedRoomName(room.title);
    setShowModal(true);
    setModalLoading(true); // Loading Start
    setSelectedRoomBookings([]); // Clear old data

    try {
      console.log("Fetching bookings for room:", room._id);

      // ✅ 1. API Call to get specific bookings
      const bookings = await fetchBookingsByRoomId(room._id);

      console.log("Bookings received:", bookings);

      if (Array.isArray(bookings)) {
        setSelectedRoomBookings(bookings);
      } else {
        setSelectedRoomBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setSelectedRoomBookings([]);
    } finally {
      setModalLoading(false); // Loading Stop
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        Loading rooms...
      </h2>
    );
  }

  return (
    <div className="rooms-container">
      <h1 className="page-title">𝕆𝕦𝕣 𝕃𝕦𝕩𝕦𝕣𝕪 ℝ𝕠𝕠𝕞𝕤</h1>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room._id}>
            <div className="room-img-wrapper">
              <img
                src={
                  room.images?.[0] || "https://placehold.co/400x300?text=Room"
                }
                alt={room.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x300?text=No+Image";
                }}
              />
            </div>

            <div className="room-details">
              <h3>{room.title}</h3>
              {room.roomNumber && (
                <span className="room-number">Room #{room.roomNumber}</span>
              )}
              <p className="price">
                ₹{room.pricePerNight} <small>/ Night</small>
              </p>
              <div className="amenities-small">
                <span>{room.fastFoodAvailable ? "🍔 Food" : "❌ No Food"}</span>
                <span>❄️ AC</span>
              </div>

              <div className="room-actions">
                <Link to={`/rooms/${room._id}`}>
                  <button className="view-btn">Book Now</button>
                </Link>
                {/* ✅ Button updated to use async function */}
                <button
                  className="check-dates-btn"
                  onClick={(e) => openBookingModal(e, room)}
                >
                  📅 Check Busy Dates
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL POPUP ================= */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Busy Dates for:{" "}
                <span style={{ color: "#d4af37" }}>{selectedRoomName}</span>
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✖
              </button>
            </div>

            <div className="modal-body">
              {/* ✅ Loading State inside Modal */}
              {modalLoading ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#aaa",
                    padding: "20px",
                  }}
                >
                  Fetching latest bookings...
                </p>
              ) : (
                <>
                  {selectedRoomBookings.length > 0 ? (
                    <ul className="booked-dates-list">
                      {selectedRoomBookings.map((booking, index) => (
                        <li key={index}>
                          <span className="date-range">
                            {formatDate(booking.checkIn)} ➝{" "}
                            {formatDate(booking.checkOut)}
                          </span>
                          <span className="status-badge">Booked</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-bookings">
                      <p>✅ This room is completely free!</p>
                      <p>No upcoming bookings found.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
