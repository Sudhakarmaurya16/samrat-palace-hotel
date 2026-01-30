const BASE_URL = "http://localhost:5000/api";

// ✅ HELPER: Get Token for Admin Requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  // 🔍 Debugging: Console me check karein ki token mil raha hai ya nahi
  console.log("Sending Token to Server:", token);

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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
// 1. ROOMS SECTION (CRUD) - Secured 🔒
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
      headers: getAuthHeaders(), // ✅ Token Added
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
      headers: getAuthHeaders(), // ✅ Token Added
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
      headers: getAuthHeaders(), // ✅ Token Added
    });
    if (!res.ok) throw new Error("Failed to delete room");
    return await res.json();
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

// ✅ ALIASES
export const createRoom = addRoom;
export const fetchRooms = fetchAllRooms;
export const getRooms = fetchAllRooms;

// =======================
// 2. HOTEL BOOKINGS (Room Stay)
// =======================

export const fetchAllBookings = async () => {
  try {
    // Admin route usually needs token too, adding strictly for Admin fetch
    const token = localStorage.getItem("token");
    const headers = token
      ? getAuthHeaders()
      : { "Content-Type": "application/json" };

    const res = await fetch(`${BASE_URL}/bookings`, { headers });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // ✅ Token Added
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update status");
    return await res.json();
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const fetchBookingById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${id}`);
    if (!res.ok) throw new Error("Booking not found");
    return await res.json();
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

export const fetchMyBookings = async (phone) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/user/${phone}`);
    if (!res.ok) throw new Error("No bookings found");
    return await res.json();
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

// =======================
// 3. RESTAURANT / FOODS - Secured 🔒
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
      headers: getAuthHeaders(), // ✅ Token Added
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
      headers: getAuthHeaders(), // ✅ Token Added
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
      headers: getAuthHeaders(), // ✅ Token Added
    });
    if (!res.ok) throw new Error("Failed to delete food");
    return await res.json();
  } catch (error) {
    console.error("Error deleting food:", error);
    throw error;
  }
};

export const createFood = addFood;

// =======================
// 4. ADMIN DASHBOARD STATS
// =======================

export const fetchAdminStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    if (!res.ok) {
      console.warn("Backend stats API not found, returning 0.");
      return { totalBookings: 0, totalRevenue: 0, totalAdvance: 0 };
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { totalBookings: 0, totalRevenue: 0, totalAdvance: 0 };
  }
};

// =======================
// 5. TABLE BOOKINGS (User Reservations)
// =======================

export const addTableBooking = async (bookingData) => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Public Booking (No Token needed typically)
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error("Failed to book table");
    return await res.json();
  } catch (error) {
    console.error("Error booking table:", error);
    throw error;
  }
};

// Alias
export const createTableBooking = addTableBooking;

export const fetchTableBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings`);
    if (!res.ok) throw new Error("Failed to fetch table bookings");
    return await res.json();
  } catch (error) {
    console.error("Error fetching table bookings:", error);
    throw error;
  }
};

export const deleteTableBooking = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Token Added (Admin Only)
    });
    if (!res.ok) throw new Error("Failed to delete table booking");
    return await res.json();
  } catch (error) {
    console.error("Error deleting table booking:", error);
    throw error;
  }
};

export const updateTableBooking = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/table-bookings/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // ✅ Token Added
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating table booking:", error);
    throw error;
  }
};

// =======================
// 6. CELEBRATION BOOKINGS
// =======================

export const createCelebrationBooking = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/celebrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to book celebration");
    return await res.json();
  } catch (error) {
    console.error("Error booking celebration:", error);
    throw error;
  }
};

export const fetchCelebrationBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/celebrations`);
    if (!res.ok) throw new Error("Failed to fetch celebrations");
    return await res.json();
  } catch (error) {
    console.error("Error fetching celebrations:", error);
    throw error;
  }
};

export const deleteCelebrationBooking = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/celebrations/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Token Added
    });
    if (!res.ok) throw new Error("Failed to delete celebration");
    return await res.json();
  } catch (error) {
    console.error("Error deleting celebration:", error);
    throw error;
  }
};

// =======================
// 7. FOOD ORDERS
// =======================

export const fetchFoodOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
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
      headers: getAuthHeaders(), // ✅ Token Added
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return await res.json();
  } catch (error) {
    console.error("Error deleting food order:", error);
    throw error;
  }
};

// =======================
// 8. ADMIN PUBLIC EVENTS - Secured 🔒
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
      headers: getAuthHeaders(), // ✅ Token Added
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add event");
    return await res.json();
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const deleteAdminEvent = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/admin-events/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Token Added
    });
    if (!res.ok) throw new Error("Failed to delete event");
    return await res.json();
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// =======================
// 9. MANAGE RESTAURANT TABLES (Physical Tables) - Secured 🔒
// =======================

// 1. Get All Tables (Public - No Token Needed)
export const fetchTables = async () => {
  try {
    const res = await fetch(`${BASE_URL}/tables`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching tables:", error);
    return [];
  }
};

// 2. Add New Table (ADMIN ONLY - Needs Token)
export const addTable = async (tableData) => {
  try {
    const res = await fetch(`${BASE_URL}/tables`, {
      method: "POST",
      headers: getAuthHeaders(), // ✅ Token Added
      body: JSON.stringify(tableData),
    });
    if (!res.ok) throw new Error("Failed to add table");
    return await res.json();
  } catch (error) {
    console.error("Error adding table:", error);
    throw error;
  }
};

// 3. Delete Table (ADMIN ONLY - Needs Token)
export const deleteTable = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/tables/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ✅ Token Added
    });
    if (!res.ok) throw new Error("Failed to delete table");
    return await res.json();
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};
