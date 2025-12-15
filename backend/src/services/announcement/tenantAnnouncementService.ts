import { AnnouncementCategory, IAnnouncement } from "../../models/Announcement";
import Announcement from "../../models/Announcement";
import { FilterQuery, Types } from "mongoose";

interface GetTenantAnnouncementsOptions {
  page?: number;
  limit?: number;
  category?: AnnouncementCategory;
  userId: string;
}

export interface TenantAnnouncementDTO {
  _id: string;
  title: string;
  message: string;
  category: AnnouncementCategory;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
}

export const getTenantAnnouncements = async (
  options: GetTenantAnnouncementsOptions
) => {
  const { page = 1, limit = 10, category, userId } = options;

  const filter: FilterQuery<IAnnouncement> = {
    published: true,
  };

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Announcement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec() as Promise<IAnnouncement[]>,
    Announcement.countDocuments(filter),
  ]);

  const userObjectId = new Types.ObjectId(userId);

  const mappedItems: TenantAnnouncementDTO[] = items.map((ann) => {
    const isRead = ann.readBy?.some((entry) => entry.user.equals(userObjectId));

    return {
      _id: ann.id.toString(),
      title: ann.title,
      message: ann.message,
      category: ann.category,
      published: ann.published,
      createdAt: ann.createdAt,
      updatedAt: ann.updatedAt,
      isRead: !!isRead,
    };
  });

  return {
    items: mappedItems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const markAnnouncementAsRead = async (
  announcementId: string,
  userId: string
): Promise<IAnnouncement | null> => {
  const announcement = await Announcement.findById(announcementId);

  if (!announcement) return null;

  const alreadyRead = announcement.readBy?.some((entry) =>
    entry.user.equals(userId)
  );

  if (!alreadyRead) {
    announcement.readBy.push({
      user: new Types.ObjectId(userId),
      readAt: new Date(),
    });
    await announcement.save();
  }

  return announcement;
};

export const markAllAnnouncementsAsRead = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);

  // Update all published announcements the user hasn't read yet
  await Announcement.updateMany(
    {
      published: true,
      "readBy.user": { $ne: userObjectId }, // not already read
    },
    {
      $push: {
        readBy: {
          user: userObjectId,
          readAt: new Date(),
        },
      },
    }
  );

  return { message: "All announcements marked as read" };
};
