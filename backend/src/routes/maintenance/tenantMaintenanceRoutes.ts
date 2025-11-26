import express from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  createMaintenanceRequest,
  getTenantRequests,
} from "../../controllers/maintenance/tenantMaintenanceController";

const router = express.Router();

router.use(protect);

// Tenant creates a request
router.post("/", createMaintenanceRequest);

// Tenant views their requests
router.get("/", getTenantRequests);

export default router;
