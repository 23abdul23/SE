const express = require("express")
const Emergency = require("../models/Emergency")
const User = require("../models/User")
const Log = require("../models/Log")

const {authenticate} = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const router = express.Router()

// Create emergency alert
router.post("/alert", authenticate, async (req, res) => {
  try {
    const { type, description, location, media, emergencyContactCalled } = req.body

    const emergency = new Emergency({
      userId: req.user.userId,
      type,
      description,
      location,
      media,
      emergencyContactCalled
    })

    await emergency.save()

    // Log the emergency alert
    const log = new Log({
      userId: req.user.userId,
      action: "emergency_alert",
      details: `Emergency alert: ${type} - ${description}`,
      location: location ? `${location.latitude}, ${location.longitude}` : null,
    })
    await log.save()

    // Populate user details for response
    await emergency.populate("userId", "name studentId phoneNumber emergencyContact")

    res.status(201).json({
      message: "Emergency alert sent successfully",
      emergency: {
        id: emergency._id,
        type: emergency.type,
        description: emergency.description,
        location: emergency.location,
        media: emergency.media,
        emergencyContactCalled: emergency.emergencyContactCalled,
        status: emergency.status,
        createdAt: emergency.createdAt,
        student: {
          name: emergency.userId.name,
          studentId: emergency.userId.studentId,
          phoneNumber: emergency.userId.phoneNumber,
          emergencyContact: emergency.userId.emergencyContact,
        },
      },
    })
  } catch (error) {
    console.error("Emergency alert error:", error)
    res.status(500).json({ message: "Server error creating emergency alert" })
  }
})

// Get user's emergency history
router.get("/my-alerts", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const emergencies = await Emergency.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Emergency.countDocuments({ userId: req.user.userId })

    res.json({
      emergencies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Emergency history error:", error)
    res.status(500).json({ message: "Server error fetching emergency history" })
  }
})

// Get emergency history (alias for my-alerts)
router.get("/history", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const emergencies = await Emergency.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Emergency.countDocuments({ userId: req.user.userId })

    res.json({
      emergencies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Emergency history error:", error)
    res.status(500).json({ message: "Server error fetching emergency history" })
  }
})

// Admin: Get all active emergencies
router.get("/admin/active", [authenticate, adminAuth], async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: "active" })
      .populate("userId", "name studentId hostel roomNumber phoneNumber emergencyContact")
      .sort({ createdAt: -1 })

    res.json({ emergencies })
  } catch (error) {
    console.error("Active emergencies fetch error:", error)
    res.status(500).json({ message: "Server error fetching active emergencies" })
  }
})

// Admin: Get all emergencies with filters
router.get("/admin/all", [authenticate, adminAuth], async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query

    const query = {}
    if (type) query.type = type
    if (status) query.status = status

    const emergencies = await Emergency.find(query)
      .populate("userId", "name studentId hostel roomNumber phoneNumber")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Emergency.countDocuments(query)

    res.json({
      emergencies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Admin emergencies fetch error:", error)
    res.status(500).json({ message: "Server error fetching emergencies" })
  }
})

// Admin: Update emergency status
router.put("/admin/:id/status", [authenticate, adminAuth], async (req, res) => {
  try {
    const { status, response } = req.body

    if (!["active", "resolved", "false_alarm"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const emergency = await Emergency.findById(req.params.id).populate("userId", "name studentId")

    if (!emergency) {
      return res.status(404).json({ message: "Emergency not found" })
    }

    emergency.status = status
    emergency.respondedBy = req.user.userId
    emergency.respondedAt = new Date()
    if (response) emergency.response = response

    await emergency.save()

    // Log the admin response
    const log = new Log({
      userId: emergency.userId._id,
      action: `emergency_${status}`,
      details: `Emergency marked as ${status} by admin${response ? `: ${response}` : ""}`,
    })
    await log.save()

    res.json({
      message: `Emergency status updated to ${status}`,
      emergency,
    })
  } catch (error) {
    console.error("Emergency status update error:", error)
    res.status(500).json({ message: "Server error updating emergency status" })
  }
})

// Get emergency statistics
router.get("/admin/stats", [authenticate, adminAuth], async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = await Emergency.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { status: "active" } }, { $count: "count" }],
          today: [{ $match: { createdAt: { $gte: today } } }, { $count: "count" }],
          byType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
        },
      },
    ])

    res.json({
      total: stats[0].total[0]?.count || 0,
      active: stats[0].active[0]?.count || 0,
      today: stats[0].today[0]?.count || 0,
      byType: stats[0].byType,
    })
  } catch (error) {
    console.error("Emergency stats error:", error)
    res.status(500).json({ message: "Server error fetching emergency statistics" })
  }
})

// Get emergency contacts
router.get("/contacts", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("emergencyContact")

    // Default emergency contacts
    const defaultContacts = [
      { name: "Campus Security", phone: "911", type: "security" },
      { name: "Medical Emergency", phone: "108", type: "medical" },
      { name: "Fire Department", phone: "101", type: "fire" },
    ]

    const contacts = [
      ...defaultContacts,
      ...(user.emergencyContact
        ? [
            {
              name: "Personal Emergency Contact",
              phone: user.emergencyContact,
              type: "personal",
            },
          ]
        : []),
    ]

    res.json({ contacts })
  } catch (error) {
    console.error("Emergency contacts error:", error)
    res.status(500).json({ message: "Server error fetching emergency contacts" })
  }
})

module.exports = router
