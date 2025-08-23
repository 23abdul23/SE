const express = require("express")
const Outpass = require("../models/Outpass")
const User = require("../models/User")
const Log = require("../models/Log")
const { authenticate } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// Create new outpass request
router.post("/request", authenticate, async (req, res) => {
  try {
    const { reason, destination, exitTime, expectedReturnTime, emergencyContact } = req.body

    const outpass = new Outpass({
      userId: req.user.userId,
      reason,
      destination,
      exitTime: new Date(exitTime),
      expectedReturnTime: new Date(expectedReturnTime),
      emergencyContact,
      auditTrail: [{
        status: "pending",
        changedBy: req.user.userId,
        changedAt: new Date(),
        remarks: "Request created"
      }]
    })

    await outpass.save()

    // Log the outpass request
    const log = new Log({
      userId: req.user.userId,
      action: "outpass_request",
      details: `Outpass requested for ${reason} to ${destination}`,
    })
    await log.save()

    res.status(201).json({
      message: "Outpass request submitted successfully",
      outpass,
    })
  } catch (error) {
    console.error("Outpass request error:", error)
    res.status(500).json({ message: "Server error creating outpass request" })
  }
})

// Get user's outpass requests
router.get("/my-requests", authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const query = { userId: req.user.userId }
    if (status) query.status = status

    const outpasses = await Outpass.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Outpass.countDocuments(query)

    res.json({
      outpasses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Outpass fetch error:", error)
    res.status(500).json({ message: "Server error fetching outpass requests" })
  }
})

// Get single outpass details
router.get("/:id", authenticate, async (req, res) => {
  try {
    const outpass = await Outpass.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" })
    }

    res.json({ outpass })
  } catch (error) {
    console.error("Outpass details error:", error)
    res.status(500).json({ message: "Server error fetching outpass details" })
  }
})

// Cancel outpass request (only if pending)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const outpass = await Outpass.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      status: "pending",
    })

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found or cannot be cancelled" })
    }

    outpass.status = "cancelled"
    await outpass.save()

    res.json({ message: "Outpass cancelled successfully" })
  } catch (error) {
    console.error("Outpass cancellation error:", error)
    res.status(500).json({ message: "Server error cancelling outpass" })
  }
})

// Admin: Get all outpass requests
router.get("/admin/all", [authenticate, adminAuth], async (req, res) => {
  try {
    const { status, hostel, page = 1, limit = 20 } = req.query

    const query = {}
    if (status) query.status = status

    const userQuery = {}
    if (hostel) userQuery.hostel = hostel

    const outpasses = await Outpass.find(query)
      .populate({
        path: "userId",
        select: "name studentId hostel roomNumber gender phoneNumber",
        match: userQuery,
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Filter out null populated users (if hostel filter didn't match)
    const filteredOutpasses = outpasses.filter((outpass) => outpass.userId)

    res.json({
      outpasses: filteredOutpasses,
      totalPages: Math.ceil(filteredOutpasses.length / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Admin outpass fetch error:", error)
    res.status(500).json({ message: "Server error fetching outpass requests" })
  }
})

// Admin: Approve/Reject outpass
router.put("/admin/:id/status", [authenticate, adminAuth], async (req, res) => {
  try {
    const { status, remarks } = req.body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const outpass = await Outpass.findById(req.params.id).populate("userId", "name studentId")

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" })
    }

    outpass.status = status
    outpass.approvedBy = req.user.userId
    outpass.approvedAt = new Date()
    if (remarks) outpass.remarks = remarks

    await outpass.save()

    // Log the admin action
    const log = new Log({
      userId: outpass.userId._id,
      action: `outpass_${status}`,
      details: `Outpass ${status} by admin${remarks ? `: ${remarks}` : ""}`,
    })
    await log.save()

    res.json({
      message: `Outpass ${status} successfully`,
      outpass,
    })
  } catch (error) {
    console.error("Outpass status update error:", error)
    res.status(500).json({ message: "Server error updating outpass status" })
  }
})

module.exports = router
