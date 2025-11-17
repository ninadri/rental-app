import { Request, Response } from "express";
import Announcement from "../models/Announcement";
import { AuthRequest } from "../middleware/authMiddleware";

// Admin creates a new announcement
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user!._id.toString(),
    });

    res.status(201).json({
      message: "Announcement created",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating announcement", error });
  }
};

// Get all announcements
export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements", error });
  }
};

// Edit an announcement
export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { title, message },
      { new: true }
    );

    res.json({
      message: "Announcement updated",
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating announcement", error });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await Announcement.findByIdAndDelete(id);

    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting announcement", error });
  }
};
