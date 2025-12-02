import express from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  createMaintenanceRequest,
  getTenantRequests,
  addImagesToMaintenanceRequest,
} from "../../controllers/maintenance/tenantMaintenanceController";

const router = express.Router();

router.use(protect);

// Tenant creates a request
router.post("/", createMaintenanceRequest);

// Tenant views their requests
router.get("/", getTenantRequests);

// Tenant adds images to a request
router.patch("/:id/images", addImagesToMaintenanceRequest);

export default router;
