import { Schema, model, Document, Types } from "mongoose";

export type AnnouncementCategory =
  | "general"
  | "maintenance"
  | "billing"
  | "urgent";

interface AnnouncementReadEntry {
  user: Types.ObjectId;
  readAt: Date;
}

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  category: AnnouncementCategory;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  readBy: AnnouncementReadEntry[];
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["general", "maintenance", "billing", "urgent"],
      default: "general",
    },
    published: {
      type: Boolean,
      default: true, // tenants will only see published ones
    },
    readBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        readAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Announcement = model<IAnnouncement>("Announcement", announcementSchema);

export default Announcement;
