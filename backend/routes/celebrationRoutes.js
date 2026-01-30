import express from "express";
import {
  createCelebration,
  getAllCelebrations,
  deleteCelebration,
} from "../controllers/celebrationController.js";

const router = express.Router();

router.post("/", createCelebration); // User: Book
router.get("/", getAllCelebrations); // Admin: View All
router.delete("/:id", deleteCelebration); // Admin: Delete

export default router;
