const BASE_URL = "http://localhost:5000/api";

// Helper to get Token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? token : "",
  };
};

// =======================
// 0. AUTH / ADMIN LOGIN
// =======================
export const adminLogin = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// =======================
// 1. ROOMS SECTION
// =======================
export const fetchAllRooms = async () => {
  try {
    const res = await fetch(`${BASE_URL}/rooms`);
    if (!res.ok) throw new Error(`Error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
};
// Aliases
export const fetchRooms = fetchAllRooms;
export const getRooms = fetchAllRooms;

export const fetchRoomById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${id}`);
    if (!res.ok) throw new Error("Failed to fetch room");
    return await res.json();
  } catch (error) {
    console.error("Error fetching room details:", error);
    throw error;
  }
};

export const addRoom = async (roomData) => {
  try {
    const res = await fetch(`${BASE_URL}/rooms`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Added Token
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error("Failed to add room");
    return await res.json();
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // ✅ Added Token
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error("Failed to update room");
    return await res.json();
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const deleteRoom = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Added Token
    });
    if (!res.ok) throw new Error("Failed to delete room");
    return await res.json();
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

// =======================
// 2. ROOM BOOKINGS & PAYMENTS
// =======================

// 🔥 NEW: Fetch Bookings specifically for one Room
export const fetchBookingsByRoomId = async (roomId) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/room/${roomId}`);
    if (!res.ok) {
      // Agar 404 aaye (No bookings), to empty array return karo
      if (res.status === 404) return [];
      throw new Error("Failed to fetch room bookings");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    return []; // Return empty array on error to prevent crash
  }
};

// Create a new booking
export const createBooking = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Booking failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const dummyPay = async (bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/dummy-pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Dummy payment failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Payment Error:", error);
    throw error;
  }
};

export const fetchAllBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      headers: getAuthHeaders(), // ✅ Added Token (Admin only)
    });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(), // ✅ Added Token
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return await res.json();
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const fetchMyBookings = async (phone) => {
  const cleanPhone = phone.toString().trim();
  try {
    const res = await fetch(`${BASE_URL}/bookings/user/${cleanPhone}`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    throw error;
  }
};

export const fetchBookingById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${id}`);
    if (!res.ok) throw new Error("Failed to fetch booking");
    return await res.json();
  } catch (error) {
    console.error("Error fetching single booking:", error);
    throw error;
  }
};

// =======================
// 3. RESTAURANT / FOODS
// =======================
export const fetchAllFoods = async () => {
  try {
    const res = await fetch(`${BASE_URL}/foods`);
    if (!res.ok) throw new Error("Failed to fetch menu");
    return await res.json();
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
};

export const addFood = async (foodData) => {
  try {
    const res = await fetch(`${BASE_URL}/foods`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Added Token
      body: JSON.stringify(foodData),
    });
    if (!res.ok) throw new Error("Failed to add food");
    return await res.json();
  } catch (error) {
    console.error("Error adding food:", error);
    throw error;
  }
};

export const updateFood = async (id, foodData) => {
  try {
    const res = await fetch(`${BASE_URL}/foods/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // ✅ Added Token
      body: JSON.stringify(foodData),
    });
    if (!res.ok) throw new Error("Failed to update food");
    return await res.json();
  } catch (error) {
    console.error("Error updating food:", error);
    throw error;
  }
};

export const deleteFood = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/foods/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Added Token
    });
    if (!res.ok) throw new Error("Failed to delete food");
    return await res.json();
  } catch (error) {
    console.error("Error deleting food:", error);
    throw error;
  }
};

// =======================
// 4. ADMIN DASHBOARD STATS
// =======================
export const fetchAdminStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(), // ✅ Added Token
    });
    if (!res.ok) return { totalBookings: 0, totalRevenue: 0, totalAdvance: 0 };
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { totalBookings: 0, totalRevenue: 0, totalAdvance: 0 };
  }
};

// =======================
// 5. TABLE RESERVATIONS (User Booking)
// =======================
export const createTableBooking = async (bookingData) => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error booking table:", error);
    throw error;
  }
};
// ✅ FIXED: Added Alias so 'addTableBooking' works
export const addTableBooking = createTableBooking;

export const fetchTableBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings`, {
      headers: getAuthHeaders(), // ✅ Token required for Admin
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching table bookings:", error);
    throw error;
  }
};

export const fetchUserTableBookings = async (phone) => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings/user/${phone}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching user table bookings:", error);
    return [];
  }
};

export const deleteTableBooking = async (id) => {
  try {
    await fetch(`${BASE_URL}/table-bookings/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting table booking:", error);
  }
};

// =======================
// ✅ 6. TABLE INVENTORY (Physical Tables - Admin)
// =======================

export const fetchTables = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tables`);
    if (!res.ok) throw new Error("Failed to fetch tables");
    return await res.json();
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};

export const addTable = async (tableData) => {
  try {
    const res = await fetch(`${BASE_URL}/tables`, {
      method: "POST",
      headers: getAuthHeaders(), // Token required
      body: JSON.stringify(tableData),
    });
    if (!res.ok) throw new Error("Failed to add table");
    return await res.json();
  } catch (error) {
    console.error("Error adding table:", error);
    throw error;
  }
};

export const deleteTable = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/tables/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // Token required
    });
    if (!res.ok) throw new Error("Failed to delete table");
    return await res.json();
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};

// =======================
// 7. CELEBRATIONS (EVENTS)
// =======================

export const createCelebrationBooking = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/celebrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error booking celebration:", error);
    throw error;
  }
};

export const fetchCelebrationBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/celebrations`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching celebrations:", error);
    throw error;
  }
};

export const deleteCelebrationBooking = async (id) => {
  try {
    await fetch(`${BASE_URL}/celebrations/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting celebration:", error);
  }
};

export const fetchUserCelebrations = async (phone) => {
  try {
    const res = await fetch(`${BASE_URL}/celebrations/user/${phone}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching user celebrations:", error);
    return [];
  }
};

// =======================
// 8. FOOD ORDERS (NEW - For Admin Dashboard)
// =======================

export const fetchFoodOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching food orders:", error);
    return [];
  }
};

export const deleteFoodOrder = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return await res.json();
  } catch (error) {
    console.error("Error deleting food order:", error);
    throw error;
  }
};

// =======================
// 9. PUBLIC EVENTS (NEW - For User & Admin)
// =======================

export const fetchAdminEvents = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin-events`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const addAdminEvent = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/admin-events`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Token
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const deleteAdminEvent = async (id) => {
  try {
    await fetch(`${BASE_URL}/admin-events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Token
    });
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};
