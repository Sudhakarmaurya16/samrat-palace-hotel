import React from "react";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <div style={{ padding: "20px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        {children}
      </div>
    </>
  );
}

export default AdminLayout;