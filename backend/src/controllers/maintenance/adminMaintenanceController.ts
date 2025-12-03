import { Response } from "express";
import MaintenanceRequest from "../../models/MaintenanceRequest";
import { AuthRequest } from "../../middleware/authMiddleware";
import { getPagination } from "../../utils/paginate";

// Get all open maintenance requests
export const getOpenMaintenanceRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { sort, urgency, sortUrgency } = req.query as {
      sort?: "asc" | "desc";
      urgency?: string;
      sortUrgency?: "asc" | "desc";
    };
    const { page, limit, skip } = getPagination(req.query);

    let sortDirection: 1 | -1 = -1;
    if (sort === "asc") sortDirection = 1;

    const openStatuses = ["pending", "in-progress"];

    const filter: any = { status: { $in: openStatuses } };
    if (urgency) filter.urgency = urgency;

    const totalRequests = await MaintenanceRequest.countDocuments(filter);

    const results = await MaintenanceRequest.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit);
    if (sortUrgency) {
      const urgencyValue: Record<string, number> = {
        low: 1,
        medium: 2,
        high: 3,
      };

      results.sort((a, b) => {
        const aVal = urgencyValue[a.urgency];
        const bVal = urgencyValue[b.urgency];
        return sortUrgency === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    res.status(200).json({
      page,
      limit,
      totalRequests,
      totalPages: Math.ceil(totalRequests / limit),

      requests: results.map((r) => {
        const obj = r.toObject();
        return {
          _id: obj._id,
          title: obj.title,
          description: obj.description,
          urgency: obj.urgency,
          status: obj.status,
          images: obj.images,
          adminNotes: obj.adminNotes,
          user: obj.user,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching open requests" });
  }
};

// Admin gets all closed requests
export const getClosedMaintenanceRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { sort, urgency, sortUrgency } = req.query as {
      sort?: "asc" | "desc";
      urgency?: string;
      sortUrgency?: "asc" | "desc";
    };
    const { page, limit, skip } = getPagination(req.query);

    let sortDirection: 1 | -1 = -1;
    if (sort === "asc") sortDirection = 1;

    const filter: any = { status: "closed" };
    if (urgency) filter.urgency = urgency;

    const totalRequests = await MaintenanceRequest.countDocuments(filter);

    const results = await MaintenanceRequest.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit);
    if (sortUrgency) {
      const urgencyValue: Record<string, number> = {
        low: 1,
        medium: 2,
        high: 3,
      };

      results.sort((a, b) => {
        const aVal = urgencyValue[a.urgency];
        const bVal = urgencyValue[b.urgency];
        return sortUrgency === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    res.status(200).json({
      page,
      limit,
      totalRequests,
      totalPages: Math.ceil(totalRequests / limit),

      requests: results.map((r) => {
        const obj = r.toObject();
        return {
          _id: obj._id,
          title: obj.title,
          description: obj.description,
          urgency: obj.urgency,
          status: obj.status,
          images: obj.images,
          adminNotes: obj.adminNotes,
          user: obj.user,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching closed requests" });
  }
};

// Admin views all maintenance requests
export const getAllMaintenanceRequests = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const { sort, urgency, sortUrgency } = _req.query as {
      sort?: "asc" | "desc";
      urgency?: string;
      sortUrgency?: "asc" | "desc";
    };
    const { page, limit, skip } = getPagination(_req.query);

    let sortDirection: 1 | -1 = -1;
    if (sort === "asc") sortDirection = 1;

    const filter: any = {};
    if (urgency) filter.urgency = urgency;

    const totalRequests = await MaintenanceRequest.countDocuments(filter);

    const results = await MaintenanceRequest.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit);

    if (sortUrgency) {
      const urgencyValue: Record<string, number> = {
        low: 1,
        medium: 2,
        high: 3,
      };

      results.sort((a, b) => {
        const aVal = urgencyValue[a.urgency];
        const bVal = urgencyValue[b.urgency];
        return sortUrgency === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    res.status(200).json({
      page,
      limit,
      totalRequests,
      totalPages: Math.ceil(totalRequests / limit),

      requests: results.map((r) => {
        const obj = r.toObject();
        return {
          _id: obj._id,
          title: obj.title,
          description: obj.description,
          urgency: obj.urgency,
          status: obj.status,
          images: obj.images,
          adminNotes: obj.adminNotes,
          user: obj.user,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
        };
      }),
    });
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
