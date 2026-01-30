// import mongoose from "mongoose";

// const foodSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true },
//     desc: { type: String, required: true },
//     image: { type: String, required: true },
//     isAvailable: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Food", foodSchema);

import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    
    // required: true hata diya taaki validation fail na ho
    desc: { type: String }, 
    image: { type: String }, 
    
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);