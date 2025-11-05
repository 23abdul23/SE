import express from "express";
import Outpass from "../models/Outpass.js";
import User from "../models/User.js";
import Log from "../models/Log.js";
import { authenticate } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkOutpassExpiry } from "../middleware/outpassExpiry.js";

const router = express.Router();

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

// Generate outpass (valid for current day only)
router.post("/generate", authenticate, async (req, res) => {
  try {
    const { purpose, destination, fromTime, toTime, emergencyName, emergencyContact } = req.body;

    // Validate input
    if (!purpose || !destination || !fromTime || !toTime) {
      return res.status(400).json({ 
        message: "Please provide all required fields: purpose, destination, fromTime, toTime" 
      });
    }

    const currentDate = new Date();
    const exitDate = new Date(fromTime);
    const returnDate = new Date(toTime);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const exitDateOnly = new Date(exitDate);
    exitDateOnly.setHours(0, 0, 0, 0);

    if (exitDateOnly.getTime() !== today.getTime()) {
      return res.status(400).json({ 
        message: "Outpass can only be generated for the current day" 
      });
    }

    const returnDateOnly = new Date(returnDate);
    returnDateOnly.setHours(0, 0, 0, 0);

    if (returnDateOnly.getTime() !== today.getTime()) {
      return res.status(400).json({ 
        message: "Return time must be on the same day as exit time" 
      });
    }

    if (returnDate <= exitDate) {
      return res.status(400).json({ 
        message: "Expected return time must be after exit time" 
      });
    }

    const existingOutpass = await Outpass.findOne({
      userId: req.user.userId,
      outDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ["pending", "approved"] }
    });

    if (existingOutpass) {
      return res.status(400).json({ 
        message: "You already have an active outpass for today" 
      });
    }

    await expireOldOutpasses();

    const outpass = new Outpass({
      userId: req.user._id,
      reason: purpose.trim(),
      destination: destination.trim(),
      outDate: exitDate,
      expectedReturnDate: returnDate,
      emergencyContact: {
        name: emergencyName || "",
        phone: emergencyContact || ""
      },
      status: "approved", // Auto-approve for same-day outpasses
      approvedBy: req.user.userId, // Self-approved for day passes
      auditTrail: [{
        status: "approved",
        changedBy: req.user.userId,
        changedAt: new Date(),
        remarks: "Same-day outpass auto-generated and approved"
      }]
    });

    await outpass.save();

    await outpass.populate("userId", "name studentId hostel roomNumber");

    const log = new Log({
      userId: req.user._id,
      action: "outpass_generated",
      details: `Same-day outpass generated for ${purpose} to ${destination}`,
    });
    await log.save();

    res.status(201).json({
      message: "Outpass generated successfully for today",
      outpass,
      validity: {
        validFrom: exitDate,
        validUntil: returnDate,
        expiresAt: new Date(tomorrow.getTime() - 1) // End of day
      }
    });

  } catch (error) {
    console.error("Outpass generation error:", error);
    res.status(500).json({ message: "Server error generating outpass" });
  }
});

// Get current day's outpass for user
router.get("/today", [authenticate, checkOutpassExpiry], async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const outpass = await Outpass.findOne({
      userId: req.user._id,
      outDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate("userId", "name studentId hostel roomNumber");

    if (!outpass) {
      return res.json({ 
        message: "No outpass found for today",
        outpass: null 
      });
    }

    const currentTime = new Date();
    if (outpass.expectedReturnDate < currentTime && outpass.status === "approved") {
      outpass.status = "expired";
      outpass.auditTrail.push({
        status: "expired",
        changedBy: null,
        changedAt: currentTime,
        remarks: "Auto-expired due to return time passed"
      });
      await outpass.save();
    }

    res.json({ 
      outpass,
      isActive: outpass.status === "approved" && outpass.expectedReturnDate > currentTime,
      timeRemaining: outpass.status === "approved" ? 
        Math.max(0, outpass.expectedReturnDate.getTime() - currentTime.getTime()) : 0
    });

  } catch (error) {
    console.error("Today's outpass fetch error:", error);
    res.status(500).json({ message: "Server error fetching today's outpass" });
  }
});

async function expireOldOutpasses() {
  try {
    const currentDate = new Date();
    
    const expiredOutpasses = await Outpass.updateMany(
      {
        status: { $in: ["pending", "approved"] },
        $or: [
          { expectedReturnDate: { $lt: currentDate } },
          { 
            outDate: { $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) },
            status: { $in: ["pending", "approved"] }
          }
        ]
      },
      {
        $set: { 
          status: "expired",
          $push: {
            auditTrail: {
              status: "expired",
              changedBy: null,
              changedAt: currentDate,
              remarks: "Auto-expired due to time limit"
            }
          }
        }
      }
    );

    console.log(`Expired ${expiredOutpasses.modifiedCount} old outpasses`);
    return expiredOutpasses.modifiedCount;
  } catch (error) {
    console.error("Error expiring old outpasses:", error);
    return 0;
  }
}

export default router;
