import express from "express";
import {
  getAllMaintenanceRequests,
  getSingleMaintenanceRequest,
  updateRequestStatus,
  closeRequest,
  getOpenMaintenanceRequests,
  getClosedMaintenanceRequests,
  addAdminNote,
  updateRequestUrgency,
  updateRequestCategory,
} from "../../controllers/maintenance/adminMaintenanceController";
import { protect, adminOnly } from "../../middleware/authMiddleware";

const router = express.Router();

// Everything below requires admin authentication
router.use(protect, adminOnly);

// Admin views all requests
router.get("/all", getAllMaintenanceRequests);

// Admin views open requests
router.get("/open", getOpenMaintenanceRequests);

// Admin views all closed requests
router.get("/closed", getClosedMaintenanceRequests);

// Admin updates urgency
router.put("/:id/urgency", updateRequestUrgency);

// Admin updates request category
router.put("/:id/category", updateRequestCategory);

// Admin updates request status
router.put("/:id/status", updateRequestStatus);

// Admin closes a request
router.put("/:id/close", closeRequest);

// Admin adds a note to a request
router.post("/:id/notes", addAdminNote);

// View single request
router.get("/:id", getSingleMaintenanceRequest);

export default router;
