import express from "express";
import Outpass from "../models/Outpass.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Create outpass
router.post("/generate", authenticate, async (req, res) => {
  try {
    const { reason, date, time } = req.body;
    
    const outpass = new Outpass({
      studentId: req.user._id,
      reason,
      date: new Date(date),
      time,
      status: 'pending'
    });

    await outpass.save();
    
    res.status(201).json({
      message: "Outpass request created successfully",
      outpass
    });
  } catch (error) {
    console.error("Outpass creation error:", error);
    res.status(500).json({ message: "Server error creating outpass" });
  }
});

// Get user outpasses
router.get("/today", authenticate, async (req, res) => {
  try {
    const outpasses = await Outpass.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ outpasses });
  } catch (error) {
    console.error("Outpass fetch error:", error);
    res.status(500).json({ message: "Server error fetching outpasses" });
  }
});

// Approve/reject outpass (for wardens)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const outpass = await Outpass.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        wardenId: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!outpass) {
      return res.status(404).json({ message: "Outpass not found" });
    }

    res.json({
      message: `Outpass ${status} successfully`,
      outpass
    });
  } catch (error) {
    console.error("Outpass update error:", error);
    res.status(500).json({ message: "Server error updating outpass" });
  }
});

export default router;
