import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";

// Tenant maintenance routes
import maintenanceRoutes from "./routes/maintenance/tenantMaintenanceRoutes";

// Admin maintenance routes
import adminMaintenanceRoutes from "./routes/maintenance/adminMaintenanceRoutes";

import announcementRoutes from "./routes/announcementRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

// Tenant maintenance
app.use("/api/maintenance", maintenanceRoutes);

// Admin maintenance
app.use("/api/admin/maintenance", adminMaintenanceRoutes);

app.use("/api/announcements", announcementRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
