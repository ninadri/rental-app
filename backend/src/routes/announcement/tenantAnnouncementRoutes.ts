import express from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  getTenantAnnouncements,
  markAnnouncementAsRead,
  markAllAnnouncementsAsRead,
} from "../../controllers/announcement/tenantAnnouncementController";

const router = express.Router();

router.use(protect);

router.get("/", getTenantAnnouncements);
router.patch("/:id/read", markAnnouncementAsRead);
router.patch("/read-all", markAllAnnouncementsAsRead);

export default router;
