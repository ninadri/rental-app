import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import maintenanceRoutes from "./routes/maintenance/tenantMaintenanceRoutes";
import adminMaintenanceRoutes from "./routes/maintenance/adminMaintenanceRoutes";
import adminAnnouncementRoutes from "./routes/announcement/adminAnnouncementRoutes";
import tenantAnnouncementRoutes from "./routes/announcement/tenantAnnouncementRoutes";

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

// Admin announcements
app.use("/api/admin/announcements", adminAnnouncementRoutes);

// Tenant announcements
app.use("/api/announcements", tenantAnnouncementRoutes);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
