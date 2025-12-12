import Announcement, {
  IAnnouncement,
  AnnouncementCategory,
} from "../../models/Announcement";
import { FilterQuery, SortOrder } from "mongoose";

interface GetAnnouncementsOptions {
  page?: number;
  limit?: number;
  category?: AnnouncementCategory;
  sort?: Record<string, SortOrder>;
  includeUnpublished?: boolean;
}

interface CreateAnnouncementInput {
  title: string;
  message: string;
  category: AnnouncementCategory;
  published?: boolean;
}

interface UpdateAnnouncementInput {
  title?: string;
  message?: string;
  category?: AnnouncementCategory;
  published?: boolean;
}

export const createAnnouncement = async (
  input: CreateAnnouncementInput
): Promise<IAnnouncement> => {
  return Announcement.create(input);
};

export const getAnnouncements = async (options: GetAnnouncementsOptions) => {
  const {
    page = 1,
    limit = 10,
    category,
    sort = { createdAt: -1 }, // newest first
    includeUnpublished = true,
  } = options;

  const filter: FilterQuery<IAnnouncement> = {};
  if (category) filter.category = category;
  if (!includeUnpublished) filter.published = true;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Announcement.find(filter).sort(sort).skip(skip).limit(limit).exec(),
    Announcement.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateAnnouncement = async (
  id: string,
  updates: UpdateAnnouncementInput
): Promise<IAnnouncement | null> => {
  return Announcement.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await Announcement.findByIdAndDelete(id).exec();
};
