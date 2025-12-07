import { Response } from "express";
import MaintenanceRequest from "../../models/MaintenanceRequest";
import { AuthRequest } from "../../middleware/authMiddleware";
import { getMaintenanceRequests } from "./getMaintenanceRequests";

// ----------------------------
// REFACTORED VIEW CONTROLLERS
// ----------------------------

// Admin: All maintenance requests
export const getAllMaintenanceRequests = getMaintenanceRequests();

// Admin: Open requests (pending + in-progress)
export const getOpenMaintenanceRequests = getMaintenanceRequests({
  status: { $in: ["pending", "in-progress"] },
});

// Admin: Closed requests
export const getClosedMaintenanceRequests = getMaintenanceRequests({
  status: "closed",
});

// ----------------------------
// INDIVIDUAL ACTION CONTROLLERS
// ----------------------------

// Admin updates status
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "in-progress", "completed", "closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status option" });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    res.status(200).json({ message: "Status updated", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Admin closes request
export const closeRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await MaintenanceRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "closed";
    await request.save();

    res.status(200).json({ message: "Request closed", request });
  } catch (error) {
    res.status(500).json({ message: "Error closing request", error });
  }
};

// Admin views single request
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

// Admin adds note
export const addAdminNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: "Note is required" });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.adminNotes.push({
      admin: req.user!._id,
      note,
      createdAt: new Date(),
    });

    await request.save();

    res.status(200).json({ message: "Admin note added", request });
  } catch (error) {
    res.status(500).json({ message: "Error adding note", error });
  }
};

// Admin updates urgency
export const updateRequestUrgency = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { urgency } = req.body;

    const validUrgencies = ["low", "medium", "high"];

    if (!validUrgencies.includes(urgency)) {
      return res.status(400).json({ message: "Invalid urgency option" });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.urgency = urgency;
    await request.save();

    res.status(200).json({ message: "Urgency updated", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating urgency", error });
  }
};

// Admin updates category
export const updateRequestCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    const validCategories = [
      "hvac",
      "kitchen",
      "washer-dryer",
      "bathroom",
      "living-room",
      "garage",
      "lawn",
      "bedroom",
      "electrical",
      "plumbing",
      "general",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category option" });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.category = category;
    await request.save();

    res.status(200).json({ message: "Category updated", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};
