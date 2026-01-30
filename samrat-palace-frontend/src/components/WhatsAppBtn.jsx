import React from "react";
// React Icons install karein: npm install react-icons
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppBtn = () => {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi, I need help with booking."
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        backgroundColor: "#25D366",
        color: "white",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        textDecoration: "none",
      }}
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppBtn;
