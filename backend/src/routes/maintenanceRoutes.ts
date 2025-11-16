import express from "express";
import {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  getSingleMaintenanceRequest,
  getTenantRequests,
} from "../controllers/maintenanceController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Tenant creates a request
router.post("/", protect, createMaintenanceRequest);

// Admin views all
router.get("/all", protect, getAllMaintenanceRequests);

// Tenant views their requests
router.get("/my", protect, getTenantRequests);

// View single request
router.get("/:id", protect, getSingleMaintenanceRequest);

export default router;
