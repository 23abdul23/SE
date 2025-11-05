import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import { generateDailyPasskeys } from "./utils/hashGenerator.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import passkeyRoutes from "./routes/passkeyRoutes.js";
import outpassRoutes from "./routes/outpassRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import forgotRoutes from "./routes/forgotRoute.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://172.19.13.123:3000",
  "http://localhost:8081", // Expo web dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/passkey", passkeyRoutes);
app.use("/api/outpass", outpassRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/forgot", forgotRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Aegis ID Backend is running",
    timestamp: new Date().toISOString(),
  });
});

if (app._router && app._router.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log("Route:", r.route.path);
    }
  });
}

// Daily passkey generation cron job (runs at midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Generating daily passkeys...");
  try {
    await generateDailyPasskeys();
    console.log("Daily passkeys generated successfully");
  } catch (error) {
    console.error("Error generating daily passkeys:", error);
  }
});

// Error handling middleware (keep this above 404 handler)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler (only once, at the very end)
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Aegis ID Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
