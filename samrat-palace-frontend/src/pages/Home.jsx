import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { fetchAllRooms, fetchAllFoods } from "../services/api"; // fetchAllFoods import kiya

function Home() {
  const [rooms, setRooms] = useState([]);
  const [foods, setFoods] = useState([]); // Food state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BACKEND_URL = "https://samrat-palace-hotel.onrender.com";

  useEffect(() => {
    const loadData = async () => {
      try {
        // Dono APIs ek sath call karenge using Promise.all
        const [roomData, foodData] = await Promise.all([
          fetchAllRooms(),
          fetchAllFoods(),
        ]);

        const roomList = Array.isArray(roomData)
          ? roomData
          : roomData.rooms || [];
        setRooms(roomList);

        const foodList = Array.isArray(foodData)
          ? foodData
          : foodData.foods || [];
        setFoods(foodList);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/400x300?text=Luxury+Item";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  // Top 3 items slice kar rahe hain
  const featuredRooms = rooms.slice(0, 3);
  const featuredFood = foods.slice(0, 3);

  return (
    <div className="hm-main-wrapper">
      {/* --- HERO SECTION --- */}
      <div className="hm-hero">
        <div className="hm-hero-overlay"></div>
        <nav className="hm-navbar">
          <div className="hm-logo">SAMRAT</div>
          <div className="hm-nav-links">
            {/* Optional: Add links if needed */}
          </div>
          <button className="hm-nav-btn" onClick={() => navigate("/rooms")}>
            Book Now
          </button>
        </nav>

        <div className="hm-3d-stage">
          <div className="hm-3d-card">
            <div className="hm-glass-shine"></div>
            <div className="hm-content-inner">
              <span className="hm-badge">Since 2024</span>
              <h1 className="hm-title">
                ROYAL <span className="hm-gold-text">SAMRAT</span> <br /> LIVING
              </h1>
              <div className="hm-separator">
                <span className="hm-dot"></span>
                <span className="hm-line"></span>
                <span className="hm-dot"></span>
              </div>
              <p className="hm-subtitle">Where Luxury Meets Heritage</p>
              <button className="hm-cta-btn" onClick={() => navigate("/rooms")}>
                Explore Suites
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED ROOMS SECTION --- */}
      <section className="hm-section">
        <div className="hm-section-header">
          <h2 className="hm-heading">Exquisite Stays</h2>
          <p className="hm-sub-heading">Experience the comfort of kings</p>
        </div>

        {loading ? (
          <div className="hm-loading">
            <div className="hm-spinner"></div>
          </div>
        ) : (
          <>
            <div className="hm-grid">
              {featuredRooms.length > 0 ? (
                featuredRooms.map((room) => (
                  <div className="hm-card" key={room._id}>
                    <div className="hm-img-box">
                      <img
                        src={getImageUrl(room.images?.[0])}
                        alt={room.title}
                        className="hm-img"
                      />
                      <div className="hm-price-badge">
                        ₹{room.pricePerNight}
                      </div>
                    </div>
                    <div className="hm-card-body">
                      <h3 className="hm-room-title">{room.title}</h3>
                      <p className="hm-room-desc">
                        {room.desc?.substring(0, 70)}...
                      </p>
                      <div className="hm-card-footer">
                        <span className="hm-amenity">
                          {room.fastFoodAvailable
                            ? "🍔 Dining"
                            : "☕ Breakfast"}
                        </span>
                        <button
                          className="hm-details-btn"
                          onClick={() => navigate(`/rooms/${room._id}`)}
                        >
                          View Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="hm-no-data">No rooms available.</p>
              )}
            </div>
            <div className="hm-action-area">
              <button
                className="hm-view-all-btn"
                onClick={() => navigate("/rooms")}
              >
                View All Collections
              </button>
            </div>
          </>
        )}
      </section>

      {/* --- NEW: RESTAURANT / DINING SECTION --- */}
      {/* Added 'hm-section-alt' for slightly different background if defined in CSS */}
      <section className="hm-section hm-section-alt">
        <div className="hm-section-header">
          <h2 className="hm-heading">Royal Cuisine</h2>
          <p className="hm-sub-heading">Taste the Legacy of Samrat</p>
        </div>

        {loading ? (
          <div className="hm-loading">
            <div className="hm-spinner"></div>
          </div>
        ) : (
          <>
            <div className="hm-grid">
              {featuredFood.length > 0 ? (
                featuredFood.map((food) => (
                  <div className="hm-card" key={food._id}>
                    <div className="hm-img-box">
                      {/* Assuming food object has 'image' property */}
                      <img
                        src={getImageUrl(food.image)}
                        alt={food.name}
                        className="hm-img"
                      />
                      <div className="hm-price-badge">₹{food.price}</div>
                    </div>

                    <div className="hm-card-body">
                      <h3 className="hm-room-title">{food.name}</h3>
                      <p className="hm-room-desc">
                        {/* Description or Category */}
                        {food.description
                          ? food.description.substring(0, 60)
                          : food.category}
                        ...
                      </p>

                      <div className="hm-card-footer">
                        <span className="hm-amenity">
                          🍽 {food.category || "Special"}
                        </span>
                        <button
                          className="hm-details-btn"
                          onClick={() => navigate("/restaurant")} // Navigates to full menu
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="hm-no-data">Menu updating shortly.</p>
              )}
            </div>

            <div className="hm-action-area">
              <button
                className="hm-view-all-btn"
                onClick={() => navigate("/restaurant")}
              >
                View Full Menu
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
