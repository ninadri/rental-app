import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateAccount,
  getMe,
} from "../controllers/authController";
import { forgotPasswordIPLimit } from "../middleware/rateLimit";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected
router.use(protect);

router.get("/me", getMe);
router.post("/change-password", changePassword);
router.patch("/account", updateAccount);

export default router;
