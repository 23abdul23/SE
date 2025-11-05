import express from "express";
import Passkey from "../models/Passkey.js";
import User from "../models/User.js";
import Log from "../models/Log.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.post("/validate", authenticate, async (req, res) => {
  try {
    const { hash, location } = req.body;

    // Find the passkey
    const passkey = await Passkey.findOne({ hash, isActive: true }).populate(
      "userId",
      "name studentId hostel roomNumber",
    );

    if (!passkey) {
      return res.status(400).json({ message: "Invalid or expired passkey" });
    }

    // Check if passkey is still valid (not expired)
    if (new Date() > passkey.expiresAt) {
      return res.status(400).json({ message: "Passkey has expired" });
    }

    // Log the entry/exit
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

router.post("/log", authenticate, async (req, res) => {
  try {
    let { action, location , guardId, guardName} = req.body;

    const totalLogs = await Log.countDocuments();
    
    if (totalLogs > 0){
      const entryLog = await Log.findOne({ userId : req.user._id}).sort({ timestamp: -1 });

      if (entryLog && entryLog.action == "entry"){
          action = "exit";
      }
    }

    const log = new Log({
      userId: req.user._id,
      action,
      location,
      guardId,
      guardName,
      timestamp: new Date(),
    });

    await log.save();

    res.status(200).json({
      message: "Security log created successfully",
      log,
    });

  } catch (error) {
    console.error("Security log error:", error);
    res.status(500).json({ message: "Server error creating security log" });
  }
});

router.get("/logs" , authenticate, async (req, res) => {
  console.log("Fetching security Logs")
  
});

export default router;
