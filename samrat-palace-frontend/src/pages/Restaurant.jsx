import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation ke liye
import FoodCard from "../components/FoodCard";
import "../styles/Restaurant.css";
import { fetchAllFoods } from "../services/api";

function Restaurant() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // ✅ CART STATE (To store selected items)
  const [cart, setCart] = useState([]);

  // Fetch Data
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const data = await fetchAllFoods();
        setFoods(data);
      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  // ✅ ADD TO PLATE FUNCTION
  const handleAddToPlate = (foodItem) => {
    // Check if item already exists
    const existing = cart.find((item) => item._id === foodItem._id);
    if (existing) {
      alert(`${foodItem.name} is already in your plate!`);
    } else {
      setCart([...cart, foodItem]);
    }
  };

  // ✅ REMOVE FROM PLATE
  const handleRemoveFromPlate = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // ✅ PROCEED TO BOOKING
  const handleProceedToBook = () => {
    // Navigate to Table Booking page with Data
    navigate("/table-booking", { state: { preSelectedFood: cart } });
  };

  // Filter Logic
  const filteredFoods =
    activeCategory === "All"
      ? foods
      : foods.filter((item) => item.category === activeCategory);

  const categories = ["All", "Fast Food", "Lunch", "Dessert"];

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <div className="menu-hero">
        <div className="hero-content">
          <h1>Exquisite Dining</h1>
          <div className="gold-divider"></div>
          <p>Taste the Legacy of Samrat Palace</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="menu-container">
        {loading ? (
          <h2 style={{ color: "white", textAlign: "center" }}>
            Loading Menu...
          </h2>
        ) : (
          <div className="food-grid">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onAdd={handleAddToPlate} // ✅ Pass function to child
                />
              ))
            ) : (
              <p style={{ color: "white", textAlign: "center" }}>
                No items found in this category.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ✅ FLOATING CART BAR (Bottom Sticky) */}
      {cart.length > 0 && (
        <div className="floating-cart-bar">
          <div className="cart-info">
            <span>🍽 {cart.length} Items Selected</span>
            <small>
              Total: ₹{cart.reduce((total, item) => total + item.price, 0)}
            </small>
          </div>
          <button className="proceed-btn" onClick={handleProceedToBook}>
            Book Table with Food ➝
          </button>
        </div>
      )}
    </div>
  );
}

export default Restaurant;
