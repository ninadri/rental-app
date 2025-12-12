import express from "express";
import { protect, adminOnly } from "../../middleware/authMiddleware";

import {
  createAnnouncement,
  getAdminAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../controllers/announcement/adminAnnouncementController";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", createAnnouncement);
router.get("/", getAdminAnnouncements);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
