import express from "express";
import {
  getAllMaintenanceRequests,
  getSingleMaintenanceRequest,
  updateRequestStatus,
  closeRequest,
  getOpenMaintenanceRequests,
} from "../../controllers/maintenance/adminMaintenanceController";
import { protect, adminOnly } from "../../middleware/authMiddleware";

const router = express.Router();

// Everything below requires admin authentication
router.use(protect, adminOnly);

// Admin views all requests
router.get("/all", getAllMaintenanceRequests);

// Admin views open requests
router.get("/open", getOpenMaintenanceRequests);

// Admin updates request status
router.put("/:id/status", updateRequestStatus);

// Admin closes a request
router.put("/:id/close", closeRequest);

// View single request
router.get("/:id", getSingleMaintenanceRequest);

export default router;
