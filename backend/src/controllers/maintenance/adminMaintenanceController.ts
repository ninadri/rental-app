import { Response } from "express";
import MaintenanceRequest from "../../models/MaintenanceRequest";
import { AuthRequest } from "../../middleware/authMiddleware";

// Get all open maintenance requests
export const getOpenMaintenanceRequests = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const { sort } = _req.query as { sort?: "asc" | "desc" };

    // Determine sorting order
    let sortDirection: 1 | -1 = -1; // newest → oldest (default)
    if (sort === "asc") sortDirection = 1;

    const openStatuses = ["pending", "in-progress"];

    const requests = await MaintenanceRequest.find({
      status: { $in: openStatuses },
    })
      .populate("user", "name email")
      .sort({ createdAt: sortDirection });

    res.status(200).json({
      message: "Open maintenance requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching open requests" });
  }
};

// Admin views all maintenance requests
export const getAllMaintenanceRequests = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const { sort } = _req.query as { sort?: "asc" | "desc" };

    // Determine sorting order
    let sortDirection: 1 | -1 = -1; // default: newest first
    if (sort === "asc") sortDirection = 1;

    const requests = await MaintenanceRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: sortDirection });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Admin updates maintenance request status
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "in-progress", "completed", "closed"];
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

// Admin closes a maintenance request
export const closeRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await MaintenanceRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Set status to closed
    request.status = "closed";
    await request.save();

    res.status(200).json({
      message: "Request closed",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error closing request",
      error,
    });
  }
};

// Admin views a single maintenance request
export const getSingleMaintenanceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error });
  }
};

// Admin gets all closed requests
export const getClosedMaintenanceRequests = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await MaintenanceRequest.find({
      status: "closed",
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Closed maintenance requests fetched successfully",
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching closed requests" });
  }
};

// Admin adds a note to a maintenance request
export const addAdminNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: "Note is required" });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.adminNotes.push({
      admin: req.user!._id,
      note,
      createdAt: new Date(),
    });

    await request.save();

    res.status(200).json({
      message: "Admin note added",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding note", error });
  }
};
