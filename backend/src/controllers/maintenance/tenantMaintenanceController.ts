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

// Tenant adds images to their maintenance request
export const addImagesToMaintenanceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { images } = req.body as { images: string[] };

    if (!Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "An array of image URLs is required" });
    }

    const request = await MaintenanceRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Make sure this request belongs to the logged-in tenant
    if (request.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // do not allow editing closed requests
    if (request.status === "closed") {
      return res
        .status(400)
        .json({ message: "Cannot add images to a closed request" });
    }

    request.images.push(...images);

    await request.save();

    res.status(200).json({
      message: "Images added to maintenance request",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding images", error });
  }
};
