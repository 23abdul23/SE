const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const cron = require("node-cron")
require("dotenv").config()

const connectDB = require("./config/db")
const { generateDailyPasskeys } = require("./utils/hashGenerator")

// Import routes
const authRoutes = require("./routes/authRoutes")
const passkeyRoutes = require("./routes/passkeyRoutes")
const outpassRoutes = require("./routes/outpassRoutes")
const emergencyRoutes = require("./routes/emergencyRoutes")
const adminRoutes = require("./routes/adminRoutes")
const securityRoutes = require("./routes/securityRoutes")
const studentRoutes = require("./routes/studentRoutes")

const app = express()
const PORT = process.env.PORT || 3000

// Connect to database
connectDB()

// Security middleware
app.use(helmet())

const allowedOrigins = [
  process.env.FRONTEND_URL || 
  "http://localhost:3000", 
  "http://172.19.13.123:3000",
  "http://localhost:8081", // Expo web dev
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/passkey", passkeyRoutes)
app.use("/api/outpass", outpassRoutes)
app.use("/api/emergency", emergencyRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/security", securityRoutes)
app.use("/api/student", studentRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Aegis ID Backend is running",
    timestamp: new Date().toISOString(),
  })
})



if (app._router && app._router.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log("Route:", r.route.path)
    }
  })
}



// Daily passkey generation cron job (runs at midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Generating daily passkeys...")
  try {
    await generateDailyPasskeys()
    console.log("Daily passkeys generated successfully")
  } catch (error) {
    console.error("Error generating daily passkeys:", error)
  }
})

// Error handling middleware (keep this above 404 handler)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler (only once, at the very end)
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})



app.listen(PORT, () => {
  console.log(`🚀 Aegis ID Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
