import express from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  getTenantAnnouncements,
  markAnnouncementAsRead,
} from "../../controllers/announcement/tenantAnnouncementController";

const router = express.Router();

router.use(protect);

router.get("/", getTenantAnnouncements);
router.patch("/:id/read", markAnnouncementAsRead);

export default router;
