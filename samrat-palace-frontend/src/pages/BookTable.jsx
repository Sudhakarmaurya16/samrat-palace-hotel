import React, { useEffect, useState } from "react";
import {
  fetchTables,
  fetchAllFoods,
  addTableBooking,
  fetchTableBookings,
} from "../services/api";
import "../styles/tableBooking.css";

const BookTable = () => {
  const [tables, setTables] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [warningDetails, setWarningDetails] = useState(null);

  // Menu & Cart
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Form
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    guests: "",
    note: "",
    tableNo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tablesData, foodData, bookingsData] = await Promise.all([
          fetchTables(),
          fetchAllFoods(),
          fetchTableBookings(),
        ]);
        setTables(Array.isArray(tablesData) ? tablesData : []);
        setMenu(Array.isArray(foodData) ? foodData : []);
        setExistingBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- HELPERS ---
  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const getTableStatus = (tableNo) => {
    if (!bookingData.date || !bookingData.time) return { status: "AVAILABLE" };
    const selectedTimeVal = parseTime(bookingData.time);

    const todaysBookings = existingBookings.filter(
      (b) =>
        b.tableNo === tableNo &&
        b.date === bookingData.date &&
        b.status !== "CANCELLED"
    );

    // Exact Clash
    const exactClash = todaysBookings.find((b) => b.time === bookingData.time);
    if (exactClash) {
      return { status: "BOOKED", bookedAt: exactClash.time };
    }

    // Future Clash (Limited Time)
    const upcomingBookings = todaysBookings
      .filter((b) => parseTime(b.time) > selectedTimeVal)
      .sort((a, b) => parseTime(a.time) - parseTime(b.time));

    if (upcomingBookings.length > 0) {
      const nextBooking = upcomingBookings[0];
      const nextTimeVal = parseTime(nextBooking.time);
      const freeByVal = nextTimeVal - 10;
      const freeByStr = formatTime(freeByVal);
      return {
        status: "LIMITED",
        nextTime: nextBooking.time,
        freeBy: freeByStr,
      };
    }
    return { status: "AVAILABLE" };
  };

  // --- HANDLERS ---
  const handleTableClick = (table, statusObj) => {
    if (table.status !== "Available") return;
    if (statusObj.status === "BOOKED") {
      alert(
        `This table is reserved at ${statusObj.bookedAt}. Please choose another.`
      );
      return;
    }
    if (statusObj.status === "LIMITED") {
      setPendingSelection(table);
      setWarningDetails(statusObj);
      setShowModal(true);
    } else {
      selectRunningTable(table);
    }
  };

  const selectRunningTable = (table) => {
    setSelectedTable(table._id);
    setBookingData({
      ...bookingData,
      tableNo: table.tableNo,
      guests: table.seats,
    });
    setTimeout(() => {
      document
        .getElementById("bottom-section")
        .scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleConfirmWarning = () => {
    if (pendingSelection) selectRunningTable(pendingSelection);
    setShowModal(false);
    setPendingSelection(null);
  };

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    if (e.target.name === "date" || e.target.name === "time") {
      setSelectedTable(null);
      setBookingData((prev) => ({ ...prev, tableNo: "" }));
    }
  };

  const updateQuantity = (foodId, delta) => {
    setCart((prev) => {
      const currentQty = prev[foodId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[foodId];
        return newCart;
      }
      return { ...prev, [foodId]: newQty };
    });
  };

  const calculateFoodTotal = () => {
    let total = 0;
    Object.keys(cart).forEach((id) => {
      const food = menu.find((item) => item._id === id);
      if (food) total += food.price * cart[id];
    });
    return total;
  };

  const foodTotal = calculateFoodTotal();
  const advanceAmount = Math.round(foodTotal * 0.4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.tableNo) return alert("Please select a table first!");
    const statusObj = getTableStatus(bookingData.tableNo);
    if (statusObj.status === "BOOKED")
      return alert("Slot taken! Please refresh.");

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
      alert(`Success! Table ${bookingData.tableNo} reserved.`);
      setExistingBookings([...existingBookings, payload]);
      setBookingData({
        ...bookingData,
        name: "",
        phone: "",
        guests: "",
        tableNo: "",
      });
      setCart({});
      setSelectedTable(null);
    } catch (error) {
      alert("Booking Failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page-container">
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-icon">⚠️</span>
            <h2>Time Limit Warning</h2>
            <p>
              This table is booked by another guest at{" "}
              <strong>{warningDetails?.nextTime}</strong>.
              <span className="warning-highlight">
                You must free this table by {warningDetails?.freeBy} (10 mins
                before).
              </span>
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-accept" onClick={handleConfirmWarning}>
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Reserve Your Table</h1>
        <p>Experience luxury dining</p>
      </div>

      <div className="booking-layout-vertical">
        {/* --- TOP SECTION: TABLES --- */}
        <div className="tables-section-full">
          <h2>1. Select a Table</h2>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="user-tables-grid">
              {tables.map((t) => {
                const statusObj = getTableStatus(t.tableNo);
                const isBooked = statusObj.status === "BOOKED";
                const isLimited = statusObj.status === "LIMITED";
                const isSelected = selectedTable === t._id;

                return (
                  <div
                    key={t._id}
                    className={`user-table-card ${t.status.toLowerCase()} ${
                      isSelected ? "selected" : ""
                    } ${isBooked ? "booked-disabled" : ""}`}
                    onClick={() => !isBooked && handleTableClick(t, statusObj)}
                    style={{
                      opacity: isBooked ? 0.6 : 1,
                      cursor: isBooked ? "not-allowed" : "pointer",
                      border: isLimited ? "1px solid #ff9800" : "",
                    }}
                  >
                    <div className="table-img-wrapper">
                      {t.image ? (
                        <img src={t.image} alt={t.tableNo} />
                      ) : (
                        <div className="no-img">No Preview</div>
                      )}
                      <span className="seat-badge">{t.seats} Seats</span>

                      {isLimited && (
                        <div className="limit-badge">
                          Next: {statusObj.nextTime}
                        </div>
                      )}
                    </div>

                    <div className="table-details">
                      <h3>{t.tableNo}</h3>
                      <p>{t.category}</p>

                      {/* DYNAMIC STATUS DISPLAY */}
                      {isBooked ? (
                        <div className="status-container booked">
                          <span>BOOKED AT {statusObj.bookedAt}</span>
                        </div>
                      ) : isSelected ? (
                        <div
                          className="status-container available"
                          style={{
                            background: "#d4af37",
                            color: "#000",
                            borderColor: "#d4af37",
                          }}
                        >
                          <span>SELECTED FOR {bookingData.time}</span>
                        </div>
                      ) : isLimited ? (
                        <div className="status-container limited">
                          <span>AVAILABLE*</span>
                          <small>Free by {statusObj.freeBy}</small>
                        </div>
                      ) : (
                        <div className="status-container available">
                          <span>BOOK FOR {bookingData.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- BOTTOM SECTION: MENU & FORM --- */}
        <div className="bottom-action-area" id="bottom-section">
          {/* Left: Food Menu */}
          <div className="menu-box">
            <h3>2. Pre-Order Food</h3>
            <input
              type="text"
              placeholder="Search food..."
              className="menu-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="mini-menu-list">
              {menu
                .filter((i) =>
                  i.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <div key={item._id} className="mini-menu-item">
                    <div className="food-item-left">
                      <img
                        src={
                          item.image ||
                          "https://cdn-icons-png.flaticon.com/512/706/706164.png"
                        }
                        alt={item.name}
                        className="food-thumb"
                      />
                      <div className="item-info">
                        <span>{item.name}</span>
                        <small>₹{item.price}</small>
                      </div>
                    </div>
                    <div className="qty-control">
                      {cart[item._id] ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, -1)}
                          >
                            -
                          </button>
                          <span>{cart[item._id]}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, 1)}
                          >
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

          {/* Right: Booking Form */}
          <div className="form-box">
            <h3>3. Confirm Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="row-inputs">
                <div style={{ flex: 1 }}>
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="selected-table-info">
                <label>Table No:</label>
                <input
                  type="text"
                  value={bookingData.tableNo || "Select Above"}
                  readOnly
                  className={bookingData.tableNo ? "highlight" : ""}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone"
                />
              </div>
              <div className="input-group">
                <input
                  type="number"
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleChange}
                  required
                  placeholder="Guests"
                  min="1"
                />
              </div>
              <button
                type="submit"
                className="confirm-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : `Confirm Booking ${
                      foodTotal > 0 ? `(Pay ₹${advanceAmount})` : ""
                    }`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
