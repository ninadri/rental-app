import { AnnouncementCategory, IAnnouncement } from "../../models/Announcement";
import Announcement from "../../models/Announcement";
import { FilterQuery } from "mongoose";

interface GetTenantAnnouncementsOptions {
  page?: number;
  limit?: number;
  category?: AnnouncementCategory;
}

export const getTenantAnnouncements = async (
  options: GetTenantAnnouncementsOptions
) => {
  const { page = 1, limit = 10, category } = options;

  const filter: FilterQuery<IAnnouncement> = {
    published: true,
  };

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Announcement.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Announcement.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
