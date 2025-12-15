import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { forgotPasswordIPLimit } from "../middleware/rateLimit";
import { changePassword } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password", forgotPasswordIPLimit, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/change-password", protect, changePassword);

export default router;
