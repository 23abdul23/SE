import express from "express";
import User from "../models/User.js";
import Passkey from "../models/Passkey.js";
import Outpass from "../models/Outpass.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get student profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// Update student profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.passwordHash; // Don't allow password updates here
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-passwordHash');
    
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// Get student dashboard stats
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOutpasses = await Outpass.countDocuments({ studentId: req.user._id });
    const activeOutpasses = await Outpass.countDocuments({ 
      studentId: req.user._id, 
      status: 'approved',
      date: { $gte: today }
    });
    const pendingOutpasses = await Outpass.countDocuments({ 
      studentId: req.user._id, 
      status: 'pending' 
    });

    res.json({
      stats: {
        totalOutpasses,
        activeOutpasses,
        pendingOutpasses
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
});

export default router;
