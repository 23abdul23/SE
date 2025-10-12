import express from "express";
import Passkey from "../models/Passkey.js";
import Log from "../models/Log.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Validate passkey
router.post("/validate", authenticate, async (req, res) => {
  try {
    const { hash, location } = req.body;
    
    const passkey = await Passkey.findOne({ hash, isActive: true })
      .populate("userId", "name studentId hostel roomNumber");

    if (!passkey || new Date() > passkey.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired passkey" });
    }

    // Log the validation
    const log = new Log({
      userId: passkey.userId._id,
      eventType: "passkey_validation",
      timestamp: new Date(),
      details: `Validated at ${location} by security ${req.user.name}`
    });
    await log.save();

    res.json({
      message: "Passkey validated successfully",
      student: {
        name: passkey.userId.name,
        studentId: passkey.userId.studentId,
        hostel: passkey.userId.hostel,
        roomNumber: passkey.userId.roomNumber
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({ message: "Server error during validation" });
  }
});

// Log entry/exit
router.post("/log", authenticate, async (req, res) => {
  try {
    const { studentId, action, location, details } = req.body;
    
    const log = new Log({
      userId: studentId,
      eventType: action,
      timestamp: new Date(),
      details: `${action} at ${location} - ${details}`
    });
    
    await log.save();
    
    res.json({
      message: "Entry/exit logged successfully",
      log
    });
  } catch (error) {
    console.error("Logging error:", error);
    res.status(500).json({ message: "Server error during logging" });
  }
});

// Get recent access logs
router.get("/logs", authenticate, async (req, res) => {
  try {
    const logs = await Log.find()
      .populate('userId', 'name studentId')
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json({ logs });
  } catch (error) {
    console.error("Logs fetch error:", error);
    res.status(500).json({ message: "Server error fetching logs" });
  }
});

export default router;
