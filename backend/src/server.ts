import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import maintenanceRoutes from "./routes/maintenance/tenantMaintenanceRoutes";
import adminMaintenanceRoutes from "./routes/maintenance/adminMaintenanceRoutes";
import adminAnnouncementRoutes from "./routes/announcement/adminAnnouncementRoutes";
import tenantAnnouncementRoutes from "./routes/announcement/tenantAnnouncementRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Insomnia/Postman
      if (/^http:\/\/localhost:517\d$/.test(origin))
        return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
// Tenant maintenance
app.use("/api/maintenance", maintenanceRoutes);
// Admin maintenance

app.use("/api/admin/maintenance", adminMaintenanceRoutes);

// Admin announcements
app.use("/api/admin/announcements", adminAnnouncementRoutes);
// Tenant announcements
app.use("/api/announcements", tenantAnnouncementRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB(); // ✅ wait for Mongo
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
