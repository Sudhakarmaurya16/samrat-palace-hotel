import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings"; // Sidebar ke liye
import RoomBookings from "./pages/RoomBookings"; // ✅ New Dedicated Page Imported
import AdminFoods from "./pages/AdminFoods";
import AdminTableBookings from "./pages/AdminTableBookings";
import AdminCelebrations from "./pages/AdminCelebrations";
import BookTable from "./pages/BookTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* User Side Table Booking */}
        <Route path="/book-table" element={<BookTable />} />

        {/* --- PROTECTED ADMIN ROUTES --- */}

        {/* 1. Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 2. Rooms */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Rooms />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 3. Room Bookings Routes */}

        {/* Option A: Sidebar Link (Legacy) */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Bookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Option B: Dashboard Link (Existing) */}
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Bookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ OPTION C: NEW DEDICATED ROOM BOOKING ROUTE */}
        {/* Ye route Dashboard ke "Room Bookings" button ke liye hai */}
        <Route
          path="/admin/room-bookings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <RoomBookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 4. Food Menu */}
        <Route
          path="/admin/foods"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminFoods />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 5. Celebrations / Events */}
        <Route
          path="/admin/celebrations"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCelebrations />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 6. Table Reservations */}
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminTableBookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/table-bookings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminTableBookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
