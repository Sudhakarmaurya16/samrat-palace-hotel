import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// --- Pages Import ---
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Restaurant from "./pages/Restaurant";
import BookTable from "./pages/BookTable"; 
import Celebrations from "./pages/Celebrations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import BookingReceipt from "./pages/BookingReceipt";
import Catering from "./pages/Catering";

// --- Components Import ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  // ✅ Navbar/Footer in pages par NAHI dikhana hai:
  // 1. Login Page
  // 2. Register Page
  // 3. Receipt Page (Clean look ke liye)
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/receipt");

  return (
    <>
      {/* Navbar show karein agar restricted page nahi hai */}
      {!hideHeaderFooter && <Navbar />}

      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<Home />} />
        {/* Rooms Routes */}
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        {/* Dining Routes */}
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/table-booking" element={<BookTable />} />{" "}
        {/* ✅ Component Corrected */}
        {/* Other Pages */}
        <Route path="/celebrations" element={<Celebrations />} />
        <Route path="/catering" element={<Catering />} />
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* User Dashboard */}
        <Route path="/my-bookings" element={<MyBookings />} />
        {/* ✅ FIX RECEIPT ROUTES */}
        {/* 1. Agar RoomDetails se direct aa rahe hain (state ke sath) */}
        <Route path="/receipt" element={<BookingReceipt />} />
        {/* 2. Agar ID ke sath URL open kiya (future use ke liye) */}
        <Route path="/receipt/:id" element={<BookingReceipt />} />
        {/* 🚨 Catch All: Agar koi galat link dale to Home par bhejo */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer show karein agar restricted page nahi hai */}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
