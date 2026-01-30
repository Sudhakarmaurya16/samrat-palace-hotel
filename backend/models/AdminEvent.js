import mongoose from "mongoose";

const adminEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String },
    videoUrl: { type: String }, // ✅ Ye line add karein
    description: { type: String },
    status: {
      type: String,
      default: "Upcoming",
      enum: ["Upcoming", "Coming Soon", "Completed"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminEvent", adminEventSchema);
