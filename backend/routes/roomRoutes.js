import express from "express";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom, // ✅ 1. Yahan Import Add kiya
} from "../controllers/roomController.js";

const router = express.Router();

// USER + ADMIN
router.get("/", getRooms);
router.get("/:id", getRoomById);

// ADMIN
router.post("/", createRoom);
router.put("/:id", updateRoom);

// ✅ 2. DELETE ROUTE ADDED
router.delete("/:id", deleteRoom);

export default router;
