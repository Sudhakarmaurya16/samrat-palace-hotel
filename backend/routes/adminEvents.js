import express from "express";
import {
  getAdminEvents,
  createAdminEvent,
  deleteAdminEvent,
} from "../controllers/adminEventController.js";

const router = express.Router();

router.get("/", getAdminEvents); // Get All
router.post("/", createAdminEvent); // Create New
router.delete("/:id", deleteAdminEvent); // Delete

export default router;
