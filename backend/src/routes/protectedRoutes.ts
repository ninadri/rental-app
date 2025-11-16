import express from "express";
import { protect } from "../middleware/authMiddleware";
import { admin } from "../middleware/adminMiddleware";

const router = express.Router();

// tenant OR admin
router.get("/private", protect, (req, res) => {
  res.json({ message: "Logged-in users only" });
});

// admin only
router.get("/admin-area", protect, admin, (req, res) => {
  res.json({ message: "Admin zone only" });
});

export default router;
