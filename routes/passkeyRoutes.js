import express from "express";
import Passkey from "../models/Passkey.js";
import User from "../models/User.js";
import Log from "../models/Log.js";
import { authenticate } from "../middleware/auth.js";
import { generatePasskeyHash } from "../utils/hashGenerator.js";

const router = express.Router();

// Get today's passkey for authenticate user
router.get("/today", authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Delete all previous passkeys for this user except today's
    await Passkey.deleteMany({
      userId: req.user._id,
      createdAt: { $lt: today }
    });
    
    let passkey = await Passkey.findOne({
      userId: req.user._id,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    if (!passkey) {
      // Generate new passkey for today
      const user = await User.findOne({studentId : req.user.studentId});
      const hash = generatePasskeyHash(user.studentId, user.deviceId, today);

      passkey = new Passkey({
        userId: req.user._id,
        hash,
        date : new Date(),
        expiresAt: tomorrow,
      });

      await passkey.save();
    }

    res.json({
      passkey: {
        id: passkey._id,
        hash: passkey.hash,
        createdAt: passkey.createdAt,
        expiresAt: passkey.expiresAt,
        isActive: passkey.isActive,
      },
    });

  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate hash detected:", error.keyValue.hash);
    } else {
      console.error("Passkey fetch error:", error);
      res.status(500).json({ message: "Server error fetching passkey" });
    }
  }
});

// Validate passkey (for security guards)
router.post("/validate", authenticate, async (req, res) => {
  try {
    const { hash, location } = req.body;

    const passkey = await Passkey.findOne({ hash, isActive: true }).populate(
      "userId",
      "name studentId hostel roomNumber",
    );

    if (!passkey) {
      return res.status(400).json({ message: "Invalid or expired passkey" });
    }

    if (new Date() > passkey.expiresAt) {
      return res.status(400).json({ message: "Passkey has expired" });
    }

    const log = new Log({
      userId: passkey.userId._id,
      action: "entry_exit",
      location,
      timestamp: new Date(),
      details: `Passkey validated at ${location}`,
    });
    await log.save();

    res.json({
      message: "Passkey validated successfully",
      student: {
        name: passkey.userId.name,
        studentId: passkey.userId.studentId,
        hostel: passkey.userId.hostel,
        roomNumber: passkey.userId.roomNumber,
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Passkey validation error:", error);
    res.status(500).json({ message: "Server error validating passkey" });
  }
});

// Get passkey history
router.get("/history", authenticate, async (req, res) => {
  try {
    const passkeys = await Passkey.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(30);
    res.json({ passkeys });
  } catch (error) {
    console.error("Passkey history error:", error);
    res.status(500).json({ message: "Server error fetching history" });
  }
});

export default router;
