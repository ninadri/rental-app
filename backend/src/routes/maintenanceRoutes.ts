import express from "express";
import {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  getSingleMaintenanceRequest,
} from "../controllers/maintenanceController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Tenant creates a request
router.post("/", protect, createMaintenanceRequest);

// Admin views all
router.get("/all", protect, getAllMaintenanceRequests);

// View single request
router.get("/:id", protect, getSingleMaintenanceRequest);

export default router;
