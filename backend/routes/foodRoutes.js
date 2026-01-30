// import express from "express";
// import {
//   getAllFoods,
//   createFood,
//   deleteFood,
// } from "../controllers/foodController.js"; // .js lagana na bhulein

// const router = express.Router();

// // Public Route
// router.get("/", getAllFoods);

// // Admin Routes
// router.post("/", createFood);
// router.delete("/:id", deleteFood);

// export default router;
// //

import express from "express";
import {
  getAllFoods,
  createFood,
  deleteFood,
  updateFood, // ✅ 1. Yahan Import Add kiya
} from "../controllers/foodController.js";

const router = express.Router();

// Public Route
router.get("/", getAllFoods);

// Admin Routes
router.post("/", createFood);

// ✅ 2. PUT Route Add kiya (Update ke liye)
router.put("/:id", updateFood);

router.delete("/:id", deleteFood);

export default router;
