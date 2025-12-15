import { Request, Response } from "express";
import * as AdminAnnouncementService from "../../services/announcement/adminAnnouncementService";
import { AnnouncementCategory } from "../../models/Announcement";

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, message, category, published } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const announcement = await AdminAnnouncementService.createAnnouncement({
      title,
      message,
      category: category as AnnouncementCategory,
      published,
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Server error creating announcement" });
  }
};

export const getAdminAnnouncements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const category = req.query.category as AnnouncementCategory | undefined;

    const result = await AdminAnnouncementService.getAnnouncements({
      page,
      limit,
      category,
      includeUnpublished: true,
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching admin announcements:", error);
    res
      .status(500)
      .json({ message: "Server error fetching admin announcements" });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await AdminAnnouncementService.updateAnnouncement(
      id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Server error updating announcement" });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await AdminAnnouncementService.deleteAnnouncement(id);
    return res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res
      .status(500)
      .json({ message: "Server error deleting announcement" });
  }
};
