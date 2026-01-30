import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true, // Ek number ke 2 room nahi banenge
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    // ✅ Fast Food Status
    fastFoodAvailable: {
      type: Boolean,
      default: false,
    },
    // ✅ Images Array (Multiple images support)
    images: {
      type: [String],
      default: [],
    },
    // ✅ Room Status
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
