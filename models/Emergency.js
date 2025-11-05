import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["medical", "security", "fire", "other"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: String,
    },
    status: {
      type: String,
      enum: ["active", "responded", "resolved"],
      default: "active",
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    responseTime: {
      type: Date,
    },
    resolvedTime: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    media: [{
      url: String,
      type: { type: String, enum: ["photo", "audio"] },
      uploadedAt: Date,
    }],
    emergencyContactCalled: {
      name: String,
      phone: String,
      calledAt: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
emergencySchema.index({ status: 1, priority: 1 })
emergencySchema.index({ userId: 1 })
emergencySchema.index({ createdAt: -1 })

export default mongoose.model("Emergency", emergencySchema)
