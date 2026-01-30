import mongoose from "mongoose";

const tableBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true },
    guests: { type: String, required: true },
    note: { type: String },

    // Pre-ordered Food (Cart)
    foodItems: { type: Object }, // { foodId: quantity } store karega
    totalAmount: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },

    status: { type: String, default: "CONFIRMED" }, // Confirmed hi rakhte hain direct
  },
  { timestamps: true }
);

export default mongoose.model("TableBooking", tableBookingSchema);
