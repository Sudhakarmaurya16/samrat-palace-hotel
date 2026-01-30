import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check karein ki user logged in hai ya nahi
  const user = localStorage.getItem("user");

  // Agar user hai, to content (Outlet) dikhao
  // Agar nahi hai, to Login page par bhej do
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
