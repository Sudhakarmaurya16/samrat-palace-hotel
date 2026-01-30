import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // ✅ FIX: "adminToken" hata kar "token" kiya (jo Login page save kar raha hai)
  const token = localStorage.getItem("token");

  if (!token) {
    // Agar token nahi hai, to Login par wapas bhejo
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
