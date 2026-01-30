import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import "../styles/home.css";
import { fetchAllRooms } from "../services/api";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook to navigate

  const BACKEND_URL = "https://samrat-palace-hotel.onrender.com";

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchAllRooms();
        // Backend se jo data aaya use state me set karein
        const roomList = Array.isArray(data) ? data : data.rooms || [];
        setRooms(roomList);
      } catch (error) {
        console.error("Failed to load rooms", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Image URL Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/400x300?text=Luxury+Room";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  // Sirf pehle 3 rooms lene ke liye logic
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div className="main-container">
      {/* --- HERO SECTION --- */}
      <div className="hero-container">
        <div className="overlay"></div>

        <nav className="navbar">
          <div className="logo">SAMRAT</div>
          <ul className="nav-links">
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/rooms")}>Suites</li>
            <li>Dining</li>
            <li>Contact</li>
          </ul>
          <button className="nav-btn" onClick={() => navigate("/rooms")}>
            Book Now
          </button>
        </nav>

        <div className="perspective-container">
          <div className="card-3d">
            <div className="content-wrapper">
              <span className="hotel-badge">Est. 2024</span>
              <h1 className="title">
                THE <br /> <span className="highlight">SAMRAT</span> PALACE
              </h1>
              <div className="divider-design">
                <span className="line"></span>
                <span className="diamond">♦</span>
                <span className="line"></span>
              </div>
              <p className="subtitle">
                Luxury Hotel | Highway Location | City Comfort
              </p>

              <div className="button-group">
                <button
                  className="cta-button primary"
                  onClick={() => navigate("/rooms")}
                >
                  Book Your Stay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED ROOMS SECTION --- */}
      <section className="rooms-section">
        <div className="section-header">
          <span className="sub-heading">Accommodations</span>
          <h2 className="section-title">Royal Stays</h2>
          <div className="gold-divider"></div>
        </div>

        {loading ? (
          <div className="loading-text">Loading Royal Suites...</div>
        ) : (
          <>
            <div className="rooms-grid">
              {featuredRooms.length > 0 ? (
                featuredRooms.map((room) => (
                  <div className="room-card" key={room._id}>
                    <div className="img-wrapper">
                      <img
                        src={getImageUrl(room.images?.[0])}
                        alt={room.title}
                      />
                      <div className="price-tag">
                        ₹{room.pricePerNight} / Night
                      </div>
                    </div>
                    <div className="room-info">
                      <h3>{room.title}</h3>
                      {/* Description ko short karne ke liye slice use kiya */}
                      <p>{room.desc?.substring(0, 80)}...</p>

                      <div className="card-footer">
                        <span className="amenities">
                          {room.fastFoodAvailable
                            ? "🍔 Fast Food"
                            : "☕ Breakfast"}
                        </span>
                        <button
                          className="book-btn"
                          onClick={() => navigate(`/rooms/${room._id}`)}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-rooms">No rooms available at the moment.</p>
              )}
            </div>

            {/* --- VIEW ALL BUTTON CONTAINER --- */}
            <div className="view-all-container">
              <button
                className="view-all-btn"
                onClick={() => navigate("/rooms")}
              >
                VIEW ALL ROOMS
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
