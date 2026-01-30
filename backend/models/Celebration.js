import mongoose from "mongoose";

const celebrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, required: true }, // Birthday, Wedding, etc.
    date: { type: String, required: true },
    guests: { type: String, required: true },
    notes: { type: String },
    status: { type: String, default: "PENDING" }, // PENDING, CONFIRMED, CANCELLED
  },
  { timestamps: true }
);

export default mongoose.model("Celebration", celebrationSchema);