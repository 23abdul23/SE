import express from "express";
import Emergency from "../models/Emergency.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Create emergency alert
router.post("/alert", authenticate, async (req, res) => {
  try {
    const { type, location, description } = req.body;
    
    const emergency = new Emergency({
      studentId: req.user._id,
      type,
      location,
      description,
      status: 'active'
    });

    await emergency.save();
    
    res.status(201).json({
      message: "Emergency alert created successfully",
      emergency
    });
  } catch (error) {
    console.error("Emergency creation error:", error);
    res.status(500).json({ message: "Server error creating emergency alert" });
  }
});

// Get emergency contacts
router.get("/contacts", authenticate, async (req, res) => {
  try {
    const contacts = [
      { name: "Campus Security", number: "911", type: "security" },
      { name: "Medical Emergency", number: "102", type: "medical" },
      { name: "Fire Department", number: "101", type: "fire" }
    ];
    
    res.json({ contacts });
  } catch (error) {
    console.error("Emergency contacts error:", error);
    res.status(500).json({ message: "Server error fetching emergency contacts" });
  }
});

// Update emergency status
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({ message: "Emergency not found" });
    }

    res.json({
      message: "Emergency status updated successfully",
      emergency
    });
  } catch (error) {
    console.error("Emergency update error:", error);
    res.status(500).json({ message: "Server error updating emergency" });
  }
});

export default router;
