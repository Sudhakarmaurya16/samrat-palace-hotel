import express from "express";
import {
  addTable,
  getAllTables,
  deleteTable,
} from "../controllers/tableInventoryController.js";

const router = express.Router();

// Base URL: /api/tables
router.post("/", addTable); // Create
router.get("/", getAllTables); // Read
router.delete("/:id", deleteTable); // Delete

export default router;
