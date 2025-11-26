import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// tenant OR admin
router.get("/private", protect, (_req, res) => {
  res.json({ message: "Logged-in users only" });
});

// admin only
router.get("/admin-area", protect, adminOnly, (_req, res) => {
  res.json({ message: "Admin zone only" });
});

export default router;
