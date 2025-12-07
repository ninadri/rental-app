import express from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  createMaintenanceRequest,
  getTenantRequests,
  addImagesToMaintenanceRequest,
} from "../../controllers/maintenance/tenantMaintenanceController";
import { upload } from "../../middleware/uploadMiddleware";

const router = express.Router();

router.use(protect);

// Tenant creates a request
router.post("/", createMaintenanceRequest);

// Tenant views their requests
router.get("/", getTenantRequests);

// Tenant adds images to a request
router.patch(
  "/:id/images",
  upload.array("images", 10),
  addImagesToMaintenanceRequest
);

export default router;
