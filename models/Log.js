import mongoose from "mongoose";
const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["entry", "exit", "scan_attempt", "outpass_request","outpass_generated", "emergency_alert"],
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    deviceInfo: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    success: {
      type: Boolean,
      default: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    errorCode: {
      type: String,
      trim: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    scanType: {
      type: String,
      enum: ["qr", "nfc", "manual"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
logSchema.index({ userId: 1, createdAt: -1 })
logSchema.index({ action: 1, createdAt: -1 })

export default mongoose.model("Log", logSchema)