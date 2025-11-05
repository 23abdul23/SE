import mongoose from "mongoose";

const outpassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    outDate: {
      type: Date,
      required: true,
    },
    expectedReturnDate: {
      type: Date,
      required: true,
    },
    actualReturnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "expired", "cancelled"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: String,
      phone: String,
    },
    auditTrail: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: Date,
        remarks: String,
      }
    ],
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
outpassSchema.index({ userId: 1, status: 1 })
outpassSchema.index({ outDate: 1 })

export default mongoose.model("Outpass", outpassSchema)
