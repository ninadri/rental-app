import { Response } from "express";
import MaintenanceRequest from "../../models/MaintenanceRequest";
import { AuthRequest } from "../../middleware/authMiddleware";
import { getPagination } from "../../utils/paginate";
import { buildMaintenanceFilter } from "../../utils/buildMaintenanceFilter";
import { buildSortOptions } from "../../utils/buildSortOptions";
import { formatRequest } from "../../utils/formatRequest";

// Tenant: Get all their maintenance requests
export const getTenantRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status, urgency, category, sort } = req.query as {
      status?: string;
      urgency?: string;
      category?: string;
      sort?: "asc" | "desc";
    };

    const { page, limit, skip } = getPagination(req.query);

    // Build filters: user + optional filters
    const filter = buildMaintenanceFilter({
      user: req.user!._id.toString(),
      status,
      urgency,
      category,
    });

    // Sorting (default newest → oldest)
    const sortOptions = buildSortOptions(sort);

    // Query
    const totalRequests = await MaintenanceRequest.countDocuments(filter);

    const results = await MaintenanceRequest.find(filter)
      .populate("user", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      totalRequests,
      totalPages: Math.ceil(totalRequests / limit),
      requests: results.map(formatRequest),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tenant requests" });
  }
};

// Tenant: Create a maintenance request
export const createMaintenanceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, description, urgency, category } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const request = await MaintenanceRequest.create({
      user: req.user!._id,
      title,
      description,
      urgency,
      category,
      status: "pending",
    });

    res.status(201).json(formatRequest(request));
  } catch (error) {
    res.status(500).json({ message: "Error creating request" });
  }
};

// Tenant: Upload images
export const addImagesToMaintenanceRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Tenant can only update their own request
    if (request.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Extract image URLs
    const uploadedUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    request.images.push(...uploadedUrls);
    await request.save();

    res.status(200).json({
      message: "Images added successfully",
      request: formatRequest(request),
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding images" });
  }
};
