import express from "express";
import {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  getSingleMaintenanceRequest,
  getTenantRequests,
  updateRequestStatus,
  closeRequest,
} from "../controllers/maintenanceController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// Tenant creates a request
router.post("/", protect, createMaintenanceRequest);

// Admin views all
router.get("/all", protect, adminOnly, getAllMaintenanceRequests);

// Tenant views their requests
router.get("/my", protect, getTenantRequests);

// Admin updates request status
router.put("/:id/status", protect, adminOnly, updateRequestStatus);

// Admin closes a request
router.put("/:id/close", protect, adminOnly, closeRequest);

// View single request
router.get("/:id", protect, getSingleMaintenanceRequest);

export default router;
