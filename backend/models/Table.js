import mongoose from "mongoose";

const TableSchema = new mongoose.Schema(
  {
    tableNo: { type: String, required: true }, // Jaise: T-1, VIP-1
    seats: { type: Number, required: true }, // Jaise: 4
    category: { type: String, default: "General" }, // VIP, Outdoor
    status: { type: String, default: "Available" }, // Available, Maintenance
    image: { type: String, default: "" }, // Cloudinary Image URL
  },
  { timestamps: true }
);

export default mongoose.model("Table", TableSchema);
