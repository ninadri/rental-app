import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateAccount,
  getMe,
  adminDeactivateTenant,
} from "../controllers/authController";
import { forgotPasswordIPLimit } from "../middleware/rateLimit";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordIPLimit, forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected
router.use(protect);

router.get("/me", getMe);
router.post("/change-password", changePassword);
router.patch("/account", updateAccount);

// Admin-only routes (after protect)
router.patch(
  "/admin/users/:id/deactivate",
  protect,
  adminOnly,
  adminDeactivateTenant
);

export default router;
