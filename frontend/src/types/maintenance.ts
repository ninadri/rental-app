export type MaintenanceStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "closed";

export interface MaintenanceUserRef {
  _id: string;
  name: string;
  email: string;
}

export interface AdminNote {
  _id?: string;
  note: string;
  createdAt?: string;
  createdBy?: string;
}

export interface MaintenanceRequest {
  _id: string;
  user: MaintenanceUserRef | string;
  title: string;
  description: string;
  status: MaintenanceStatus;

  urgency?: string;
  category?: string;
  adminNotes?: AdminNote[];

  createdAt?: string;
  updatedAt?: string;

  images?: string[];
}
