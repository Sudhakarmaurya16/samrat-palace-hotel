import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { fetchAllRooms } from "../services/api";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BACKEND_URL = "https://samrat-palace-hotel.onrender.com";

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchAllRooms();
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

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/400x300?text=Luxury+Room";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const featuredRooms = rooms.slice(0, 3);

  return (
    <div className="main-container">
      {/* HERO SECTION - (Same as before) */}
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
                      {/* Price tag ko image ke andar hi rakha hai */}
                      <div className="price-tag">₹{room.pricePerNight}</div>
                    </div>

                    <div className="room-info">
                      <h3 className="room-title">{room.title}</h3>
                      <div className="divider-small"></div>

                      <p className="room-desc">
                        {room.desc?.substring(0, 60)}...
                      </p>

                      <div className="card-footer">
                        <div className="amenity-item">
                          {/* Icon Style */}
                          {room.fastFoodAvailable
                            ? "🍔 Fast Food"
                            : "☕ Breakfast"}
                        </div>

                        <button
                          className="view-details-btn"
                          onClick={() => navigate(`/rooms/${room._id}`)}
                        >
                          VIEW DETAILS ➝
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-rooms">No rooms available at the moment.</p>
              )}
            </div>

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
