import { Response } from "express";
import MaintenanceRequest from "../../models/MaintenanceRequest";
import { AuthRequest } from "../../middleware/authMiddleware";
import { getPagination } from "../../utils/paginate";
import { buildMaintenanceFilter } from "../../utils/buildMaintenanceFilter";
import { buildSortOptions } from "../../utils/buildSortOptions";
import { formatRequest } from "../../utils/formatRequest";

export const getMaintenanceRequests =
  (baseFilter: any = {}) =>
  async (req: AuthRequest, res: Response) => {
    try {
      const { page, limit, skip } = getPagination(req.query);

      // Build final MongoDB filter
      const filter = buildMaintenanceFilter(req.query, baseFilter);

      // Sorting
      const sort = buildSortOptions(req.query);

      // Query
      const totalRequests = await MaintenanceRequest.countDocuments(filter);

      const results = await MaintenanceRequest.find(filter)
        .populate("user", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit);

      // Custom urgency sort after pulling results (if needed)
      if (req.query.sortUrgency) {
        const urgencyRank = { low: 1, medium: 2, high: 3 };

        results.sort((a, b) => {
          const diff = urgencyRank[a.urgency] - urgencyRank[b.urgency];

          return req.query.sortUrgency === "asc" ? diff : -diff;
        });
      }

      res.status(200).json({
        page,
        limit,
        totalRequests,
        totalPages: Math.ceil(totalRequests / limit),
        requests: results.map(formatRequest),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching requests", error });
    }
  };
