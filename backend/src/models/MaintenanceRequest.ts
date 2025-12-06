import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

export interface IAdminNote {
  admin: Types.ObjectId | string;
  note: string;
  createdAt: Date;
}

export interface IMaintenanceRequest extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "closed";
  adminNotes: IAdminNote[];
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminNoteSchema = new Schema<IAdminNote>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const maintenanceSchema = new Schema<IMaintenanceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },

    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "low",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "closed"],
      default: "pending",
    },

    adminNotes: [AdminNoteSchema],

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMaintenanceRequest>(
  "MaintenanceRequest",
  maintenanceSchema
);
