import { Request, Response } from "express";
import MaintenanceRequest from "../models/MaintenanceRequest";
import { AuthRequest } from "../middleware/authMiddleware";

export const createMaintenanceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const request = await MaintenanceRequest.create({
      user: req.user!._id,
      title,
      description,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error); // 👈 THIS WILL SHOW REAL ERROR IN TERMINAL
    res.status(500).json({ message: "Error creating request", error });
  }
};

export const getAllMaintenanceRequests = async (
  req: Request,
  res: Response
) => {
  try {
    // Only allow admins
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const requests = await MaintenanceRequest.find().populate("user", "name");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

export const getSingleMaintenanceRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id).populate(
      "user",
      "name"
    );
    if (!request) return res.status(404).json({ message: "Not found" });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error });
  }
};

export const getTenantRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await MaintenanceRequest.find({
      user: req.user!._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error getting your requests" });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Must be admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status option" });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: "Status updated", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
