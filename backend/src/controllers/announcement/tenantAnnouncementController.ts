import { Request, Response } from "express";
import * as TenantAnnouncementService from "../../services/announcement/tenantAnnouncementService";
import { AnnouncementCategory } from "../../models/Announcement";

// Tenant Get Announcements (with isRead)
export const getTenantAnnouncements = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // safe, protect middleware guarantees this

    if (!user || !user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const category = req.query.category as AnnouncementCategory | undefined;

    const result = await TenantAnnouncementService.getTenantAnnouncements({
      page,
      limit,
      category,
      userId: user._id.toString(),
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching tenant announcements:", error);
    res.status(500).json({
      message: "Server error fetching tenant announcements",
    });
  }
};

// Tenant Mark Announcement as Read
export const markAnnouncementAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    const updated = await TenantAnnouncementService.markAnnouncementAsRead(
      id,
      user._id.toString()
    );

    if (!updated) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    return res.status(200).json({ message: "Announcement marked as read" });
  } catch (error) {
    console.error("Error marking announcement as read:", error);
    res.status(500).json({
      message: "Server error marking announcement as read",
    });
  }
};
