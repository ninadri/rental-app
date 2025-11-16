import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenanceRequest extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

const maintenanceSchema = new Schema<IMaintenanceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMaintenanceRequest>(
  "MaintenanceRequest",
  maintenanceSchema
);
