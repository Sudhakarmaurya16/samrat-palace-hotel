import React, { useEffect, useState } from "react";
import { fetchTables, fetchAllFoods, addTableBooking } from "../services/api";
import "./styles/tableBooking.css";

const BookTable = () => {
  // --- STATE ---
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  // Menu & Cart
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Form
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    note: "",
    tableNo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Tables & Foods
        const tableRes = await fetchTables();
        const foodRes = await fetchAllFoods();
        setTables(Array.isArray(tableRes) ? tableRes : []);
        setMenu(Array.isArray(foodRes) ? foodRes : []);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleTableSelect = (table) => {
    if (table.status !== "Available") return;

    setSelectedTable(table._id);
    setBookingData({
      ...bookingData,
      tableNo: table.tableNo,
      guests: table.seats, // Auto-fill guests
    });
  };

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  // Cart Handlers
  const updateQuantity = (foodId, delta) => {
    setCart((prev) => {
      const current = prev[foodId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return { ...prev, [foodId]: updated };
    });
  };

  const calculateTotal = () => {
    return Object.keys(cart).reduce((total, id) => {
      const item = menu.find((f) => f._id === id);
      return total + (item ? item.price * cart[id] : 0);
    }, 0);
  };

  const foodTotal = calculateTotal();
  const advanceAmount = Math.round(foodTotal * 0.4);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.tableNo) return alert("Please select a table first!");
    if (!bookingData.name || !bookingData.phone || !bookingData.date)
      return alert("Please fill details.");

    setIsSubmitting(true);
    const payload = {
      ...bookingData,
      foodItems: cart,
      totalAmount: foodTotal,
      advancePaid: advanceAmount,
      remainingAmount: foodTotal - advanceAmount,
      status: "CONFIRMED",
    };

    try {
      await addTableBooking(payload);
      alert(`Success! Table ${bookingData.tableNo} Booked.`);
      // Reset
      setBookingData({
        ...bookingData,
        name: "",
        phone: "",
        date: "",
        time: "",
        tableNo: "",
      });
      setCart({});
      setSelectedTable(null);
    } catch (error) {
      alert("Booking Failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page-container">
      <div className="page-header">
        <h1>Reserve Your Table</h1>
        <p>Experience luxury dining at Samrat Palace</p>
      </div>

      <div className="booking-layout">
        {/* === COLUMN 1: TABLE SELECTION === */}
        <div className="tables-grid-section">
          <h2>1. Select Table</h2>
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="user-tables-grid">
              {tables.map((t) => (
                <div
                  key={t._id}
                  className={`user-table-card ${t.status} ${
                    selectedTable === t._id ? "selected" : ""
                  }`}
                  onClick={() => handleTableSelect(t)}
                >
                  <div className="table-img-wrapper">
                    {t.image ? (
                      <img src={t.image} alt="table" />
                    ) : (
                      <div className="no-img">No Preview</div>
                    )}
                    <span className="seat-badge">{t.seats} Seats</span>
                  </div>
                  <div className="table-details">
                    <h3>{t.tableNo}</h3>
                    <p>{t.category}</p>
                    <div className={`status-dot ${t.status}`}>
                      {t.status === "Available" ? "Click to Book" : t.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === RIGHT SIDE WRAPPER === */}
        <div className="booking-form-section">
          {/* === COLUMN 2: FOOD MENU === */}
          <div className="menu-box">
            <h3>2. Pre-Order Food</h3>
            <input
              className="menu-search-input"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="mini-menu-list">
              {menu
                .filter((f) =>
                  f.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <div key={item._id} className="mini-menu-item">
                    <div className="item-info">
                      <span>{item.name}</span>
                      <small>₹{item.price}</small>
                    </div>
                    <div className="qty-control">
                      {cart[item._id] ? (
                        <>
                          <button onClick={() => updateQuantity(item._id, -1)}>
                            -
                          </button>
                          <span>{cart[item._id]}</span>
                          <button onClick={() => updateQuantity(item._id, 1)}>
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          className="add-btn-small"
                          onClick={() => updateQuantity(item._id, 1)}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {foodTotal > 0 && (
              <div className="cart-summary-bar">
                <span>Total: ₹{foodTotal}</span>
                <small>Adv: ₹{advanceAmount}</small>
              </div>
            )}
          </div>

          {/* === COLUMN 3: FORM === */}
          <div className="form-box">
            <h3>3. Confirm Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="selected-table-info">
                <label>Table No</label>
                <input
                  value={bookingData.tableNo || "Select Table"}
                  readOnly
                  className={bookingData.tableNo ? "active" : ""}
                />
              </div>

              <div className="input-group">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={bookingData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={bookingData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row-inputs">
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="number"
                  name="guests"
                  placeholder="Guests"
                  value={bookingData.guests}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="confirm-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "CONFIRM BOOKING"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
