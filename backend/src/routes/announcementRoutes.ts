import express from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Admin creates announcement
router.post("/", protect, adminOnly, createAnnouncement);

// Admin updates announcement
router.put("/:id", protect, adminOnly, updateAnnouncement);

// Admin deletes announcement
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

// Anyone can read announcements
router.get("/", protect, getAllAnnouncements);

export default router;
