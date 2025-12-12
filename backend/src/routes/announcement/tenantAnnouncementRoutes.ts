import express from "express";
import { protect } from "../../middleware/authMiddleware";
import { getTenantAnnouncements } from "../../controllers/announcement/tenantAnnouncementController";

const router = express.Router();

router.use(protect);

router.get("/", getTenantAnnouncements);

export default router;
