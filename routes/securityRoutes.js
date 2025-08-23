const express = require("express")
const Passkey = require("../models/Passkey")
const User = require("../models/User")
const Log = require("../models/Log")
const {authenticate} = require("../middleware/auth")
const router = express.Router()

router.post("/validate", authenticate, async (req, res) => {
  try {
    const { hash, location } = req.body

    // Find the passkey
    const passkey = await Passkey.findOne({ hash, isActive: true }).populate(
      "userId",
      "name studentId hostel roomNumber",
    )

    if (!passkey) {
      return res.status(400).json({ message: "Invalid or expired passkey" })
    }

    // Check if passkey is still valid (not expired)
    if (new Date() > passkey.expiresAt) {
      return res.status(400).json({ message: "Passkey has expired" })
    }

    // Log the entry/exit
    const log = new Log({
      userId: passkey.userId._id,
      action: "entry_exit",
      location,
      timestamp: new Date(),
      details: `Passkey validated at ${location}`,
    })
    await log.save()

    res.json({
      message: "Passkey validated successfully",
      student: {
        name: passkey.userId.name,
        studentId: passkey.userId.studentId,
        hostel: passkey.userId.hostel,
        roomNumber: passkey.userId.roomNumber,
      },
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Passkey validation error:", error)
    res.status(500).json({ message: "Server error validating passkey" })
  }
})

router.post("/log", authenticate, async (req, res) => {
  try {
    const { action, location, details } = req.body

    const log = new Log({
      userId: req.user.userId,
      action,
      location,
      details,
      timestamp: new Date(),
    })

    await log.save()

    res.json({
      message: "Security log created successfully",
      log,
    })
  } catch (error) {
    console.error("Security log error:", error)
    res.status(500).json({ message: "Server error creating security log" })
  }
})

module.exports = router
