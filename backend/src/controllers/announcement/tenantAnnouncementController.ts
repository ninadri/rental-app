import { Request, Response } from "express";
import * as TenantAnnouncementService from "../../services/announcement/tenantAnnouncementService";
import { AnnouncementCategory } from "../../models/Announcement";

export const getTenantAnnouncements = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const category = req.query.category as AnnouncementCategory | undefined;

    const result = await TenantAnnouncementService.getTenantAnnouncements({
      page,
      limit,
      category,
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching tenant announcements:", error);
    res
      .status(500)
      .json({ message: "Server error fetching tenant announcements" });
  }
};
