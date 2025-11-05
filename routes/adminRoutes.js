import express from "express";
import User from "../models/User.js";
import Passkey from "../models/Passkey.js";
import Outpass from "../models/Outpass.js";
import Emergency from "../models/Emergency.js";
import Log from "../models/Log.js";
import GuardUser from "../models/GuardUser.js";
import WardenUser from "../models/WardenUser.js";
import { authenticate } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// Get dashboard statistics
router.get("/dashboard/stats", [authenticate, adminAuth], async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = await Promise.all([
      User.countDocuments({ role: "student" }),
      Passkey.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Outpass.countDocuments({ status: "pending" }),
      Emergency.countDocuments({ status: "active" }),
      Log.countDocuments({ timestamp: { $gte: today, $lt: tomorrow } }),
    ]);

    res.json({
      totalStudents: stats[0],
      activePasskeys: stats[1],
      pendingOutpasses: stats[2],
      activeEmergencies: stats[3],
      todayLogs: stats[4],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error fetching dashboard statistics" });
  }
});

// Get all students with filters
router.get("/students", [authenticate, adminAuth], async (req, res) => {
  try {
    const { hostel, search, page = 1, limit = 20 } = req.query;

    const query = { role: "student" };
    if (hostel) query.hostel = hostel;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const students = await User.find(query)
      .select("-password")
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Students fetch error:", error);
    res.status(500).json({ message: "Server error fetching students" });
  }
});

// Get student details with recent activity
router.get("/students/:id", [authenticate, adminAuth], async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get recent activity
    const recentLogs = await Log.find({ userId: req.params.id }).sort({ timestamp: -1 }).limit(10);

    const recentOutpasses = await Outpass.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(5);

    const recentEmergencies = await Emergency.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(5);

    res.json({
      student,
      recentActivity: {
        logs: recentLogs,
        outpasses: recentOutpasses,
        emergencies: recentEmergencies,
      },
    });
  } catch (error) {
    console.error("Student details error:", error);
    res.status(500).json({ message: "Server error fetching student details" });
  }
});

// Get system logs with filters
router.get("/logs", [authenticate, adminAuth], async (req, res) => {
  try {
    const { action, userId, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query)
      .populate("userId", "name studentId")
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Log.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Logs fetch error:", error);
    res.status(500).json({ message: "Server error fetching logs" });
  }
});

// Get hostel-wise statistics
router.get("/hostels/stats", [authenticate, adminAuth], async (req, res) => {
  try {
    const hostelStats = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: "$hostel",
          totalStudents: { $sum: 1 },
          activeStudents: {
            $sum: {
              $cond: [{ $gte: ["$lastLogin", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get pending outpasses by hostel
    const outpassStats = await Outpass.aggregate([
      { $match: { status: "pending" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.hostel",
          pendingOutpasses: { $sum: 1 },
        },
      },
    ]);

    // Merge the statistics
    const mergedStats = hostelStats.map((hostel) => {
      const outpassStat = outpassStats.find((stat) => stat._id === hostel._id);
      return {
        ...hostel,
        pendingOutpasses: outpassStat ? outpassStat.pendingOutpasses : 0,
      };
    });

    res.json({ hostelStats: mergedStats });
  } catch (error) {
    console.error("Hostel stats error:", error);
    res.status(500).json({ message: "Server error fetching hostel statistics" });
  }
});

// Update student status (active/inactive)
router.put("/students/:id/status", [authenticate, adminAuth], async (req, res) => {
  try {
    const { isActive } = req.body;

    const student = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Log the admin action
    const log = new Log({
      userId: req.params.id,
      action: "status_update",
      details: `Student status updated to ${isActive ? "active" : "inactive"} by admin`,
    });
    await log.save();

    res.json({
      message: `Student status updated successfully`,
      student,
    });
  } catch (error) {
    console.error("Student status update error:", error);
    res.status(500).json({ message: "Server error updating student status" });
  }
});

export default router;
