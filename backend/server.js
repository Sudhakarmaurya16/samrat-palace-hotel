import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

// --- ROUTES IMPORTS ---
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import celebrationRoutes from "./routes/celebrationRoutes.js";
import adminEventRoutes from "./routes/adminEvents.js";
import tableInventoryRoutes from "./routes/tableInventoryRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// --- API ROUTES SETUP ---
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/celebrations", celebrationRoutes);
app.use("/api/admin-events", adminEventRoutes);
app.use("/api/table-bookings", tableRoutes);
app.use("/api/tables", tableInventoryRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Samrat Palace Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
