import { Response } from "express";
import MaintenanceRequest from "../../models/MaintenanceRequest";
import { AuthRequest } from "../../middleware/authMiddleware";

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
      status: "pending",
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating request", error });
  }
};

// Tenant views their requests
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
