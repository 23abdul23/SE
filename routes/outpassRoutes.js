const express = require("express")
const Outpass = require("../models/Outpass")
const User = require("../models/User")
const Log = require("../models/Log")
const { authenticate } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth")
const { checkOutpassExpiry } = require("../middleware/outpassExpiry")

const router = express.Router()

// // Create new outpass request
// router.post("/request", authenticate, async (req, res) => {
//   try {
//     const { reason, destination, fromTime, toTime, emergencyContact } = req.body

//     const outpass = new Outpass({
//       userId: req.user.userId,
//       reason,
//       destination,
//       outDate: new Date(fromTime),
//       expectedReturnDate: new Date(toTime),
//       emergencyContact,
//       auditTrail: [{
//         status: "pending",
//         changedBy: req.user.userId,
//         changedAt: new Date(),
//         remarks: "Request created"
//       }]
//     })

//     await outpass.save()

//     // Log the outpass request
//     const log = new Log({
//       userId: req.user.userId,
//       action: "outpass_request",
//       details: `Outpass requested for ${reason} to ${destination}`,
//     })
//     await log.save()

//     res.status(201).json({
//       message: "Outpass request submitted successfully",
//       outpass,
//     })
//   } catch (error) {
//     console.error("Outpass request error:", error)
//     res.status(500).json({ message: "Server error creating outpass request" })
//   }
// })

// // Get user's outpass requests
// router.get("/my-requests", [authenticate, checkOutpassExpiry], async (req, res) => {
//   try {
//     const { status, page = 1, limit = 10 } = req.query

//     const query = { userId: req.user.userId }
//     if (status) query.status = status

//     const outpasses = await Outpass.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)

//     const total = await Outpass.countDocuments(query)

//     res.json({
//       outpasses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//     })
//   } catch (error) {
//     console.error("Outpass fetch error:", error)
//     res.status(500).json({ message: "Server error fetching outpass requests" })
//   }
// })

// Get single outpass details


// router.get("/:id", authenticate, async (req, res) => {
//   try {
//     const outpass = await Outpass.findOne({
//       _id: req.params.id,
//       userId: req.user.userId,
//     })

//     if (!outpass) {
//       return res.status(404).json({ message: "Outpass not found" })
//     }

//     res.json({ outpass })
//   } catch (error) {
//     console.error("Outpass details error:", error)
//     res.status(500).json({ message: "Server error fetching outpass details" })
//   }
// })

// // Cancel outpass request (only if pending)
// router.delete("/:id", authenticate, async (req, res) => {
//   try {
//     const outpass = await Outpass.findOne({
//       _id: req.params.id,
//       userId: req.user.userId,
//       status: "pending",
//     })

//     if (!outpass) {
//       return res.status(404).json({ message: "Outpass not found or cannot be cancelled" })
//     }

//     outpass.status = "cancelled"
//     await outpass.save()

//     res.json({ message: "Outpass cancelled successfully" })
//   } catch (error) {
//     console.error("Outpass cancellation error:", error)
//     res.status(500).json({ message: "Server error cancelling outpass" })
//   }
// })

// // Admin: Get all outpass requests
// router.get("/admin/all", [authenticate, adminAuth, checkOutpassExpiry], async (req, res) => {
//   try {
//     const { status, hostel, page = 1, limit = 20 } = req.query

//     const query = {}
//     if (status) query.status = status

//     const userQuery = {}
//     if (hostel) userQuery.hostel = hostel

//     const outpasses = await Outpass.find(query)
//       .populate({
//         path: "userId",
//         select: "name studentId hostel roomNumber gender phoneNumber",
//         match: userQuery,
//       })
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)

//     // Filter out null populated users (if hostel filter didn't match)
//     const filteredOutpasses = outpasses.filter((outpass) => outpass.userId)

//     res.json({
//       outpasses: filteredOutpasses,
//       totalPages: Math.ceil(filteredOutpasses.length / limit),
//       currentPage: page,
//     })
//   } catch (error) {
//     console.error("Admin outpass fetch error:", error)
//     res.status(500).json({ message: "Server error fetching outpass requests" })
//   }
// })

// // Admin: Approve/Reject outpass
// router.put("/admin/:id/status", [authenticate, adminAuth], async (req, res) => {
//   try {
//     const { status, remarks } = req.body

//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" })
//     }

//     const outpass = await Outpass.findById(req.params.id).populate("userId", "name studentId")

//     if (!outpass) {
//       return res.status(404).json({ message: "Outpass not found" })
//     }

//     outpass.status = status
//     outpass.approvedBy = req.user.userId
//     outpass.approvedAt = new Date()
//     if (remarks) outpass.remarks = remarks

//     await outpass.save()

//     // Log the admin action
//     const log = new Log({
//       userId: outpass.userId._id,
//       action: `outpass_${status}`,
//       details: `Outpass ${status} by admin${remarks ? `: ${remarks}` : ""}`,
//     })
//     await log.save()

//     res.json({
//       message: `Outpass ${status} successfully`,
//       outpass,
//     })
//   } catch (error) {
//     console.error("Outpass status update error:", error)
//     res.status(500).json({ message: "Server error updating outpass status" })
//   }
// })


// // Check and expire outpasses endpoint (can be called manually or via cron job)
// router.post("/admin/expire-old", [authenticate, adminAuth], async (req, res) => {
//   try {
//     const expiredCount = await expireOldOutpasses()
    
//     res.json({
//       message: "Outpass expiry check completed",
//       expiredCount
//     })
//   } catch (error) {
//     console.error("Manual expiry check error:", error)
//     res.status(500).json({ message: "Server error during expiry check" })
//   }
// })


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
    const { purpose, destination, fromTime, toTime, emergencyName, emergencyContact } = req.body

    // Validate input
    if (!purpose || !destination || !fromTime || !toTime) {
      return res.status(400).json({ 
        message: "Please provide all required fields: purpose, destination, fromTime, toTime" 
      })
    }

    const currentDate = new Date()
    const exitDate = new Date(fromTime)
    const returnDate = new Date(toTime)

    // console.log(formatDateTime(currentDate))
    // console.log(formatDateTime(exitDate))
    // console.log(formatDateTime(returnDate))

    // Check if exit time is for today only
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const exitDateOnly = new Date(exitDate)
    exitDateOnly.setHours(0, 0, 0, 0)

    if (exitDateOnly.getTime() !== today.getTime()) {
      return res.status(400).json({ 
        message: "Outpass can only be generated for the current day" 
      })
    }

    // // Check if exit time is not in the past
    // if (exitDate < currentDate) {
    //   return res.status(400).json({ 
    //     message: "Exit time cannot be in the past" 
    //   })
    // }

    // Ensure return time is within the same day
    const returnDateOnly = new Date(returnDate)
    returnDateOnly.setHours(0, 0, 0, 0)

    if (returnDateOnly.getTime() !== today.getTime()) {
      return res.status(400).json({ 
        message: "Return time must be on the same day as exit time" 
      })
    }

    // Check if return time is after exit time
    if (returnDate <= exitDate) {
      return res.status(400).json({ 
        message: "Expected return time must be after exit time" 
      })
    }

    // Check for existing active outpass for today
    const existingOutpass = await Outpass.findOne({
      userId: req.user.userId,
      outDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ["pending", "approved"] }
    })

    if (existingOutpass) {
      return res.status(400).json({ 
        message: "You already have an active outpass for today" 
      })
    }

    // Auto-expire any old outpasses before creating new one
    await expireOldOutpasses()

    // Create new outpass
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
    })

    await outpass.save()

    // Populate user details for response
    await outpass.populate("userId", "name studentId hostel roomNumber")

    // Log the outpass generation
    const log = new Log({
      userId: req.user._id,
      action: "outpass_generated",
      details: `Same-day outpass generated for ${purpose} to ${destination}`,
    })
    await log.save()

    res.status(201).json({
      message: "Outpass generated successfully for today",
      outpass,
      validity: {
        validFrom: exitDate,
        validUntil: returnDate,
        expiresAt: new Date(tomorrow.getTime() - 1) // End of day
      }
    })

  } catch (error) {
    console.error("Outpass generation error:", error)
    res.status(500).json({ message: "Server error generating outpass" })
  }
})


// Get complete outpass history for the authenticated student
router.get("/history", [authenticate, checkOutpassExpiry], async (req, res) => {
  try {
    const { status, limit } = req.query
    const parsedLimit = Math.min(parseInt(limit, 10) || 25, 100)

    const query = { userId: req.user._id }
    if (status && typeof status === "string" && status.trim().length > 0) {
      query.status = status.trim().toLowerCase()
    }

    // Make sure any stale outpasses are expired before returning history
    await expireOldOutpasses()

    const outpasses = await Outpass.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .populate("userId", "name studentId hostel roomNumber")

    res.json({ outpasses })
  } catch (error) {
    console.error("Outpass history fetch error:", error)
    res.status(500).json({ message: "Server error fetching outpass history" })
  }
})

// Get current day's outpass for user
router.get("/today", [authenticate, checkOutpassExpiry], async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)


    const outpass = await Outpass.findOne({
      userId: req.user._id,
      outDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate("userId", "name studentId hostel roomNumber")


    if (!outpass) {
      return res.json({ 
        message: "No outpass found for today",
        outpass: null 
      })
    }

    // Check if outpass should be expired
    const currentTime = new Date()
    if (outpass.expectedReturnDate < currentTime && outpass.status === "approved") {
      outpass.status = "expired"
      outpass.auditTrail.push({
        status: "expired",
        changedBy: null,
        changedAt: currentTime,
        remarks: "Auto-expired due to return time passed"
      })
      await outpass.save()
    }

    res.json({ 
      outpass,
      isActive: outpass.status === "approved" && outpass.expectedReturnDate > currentTime,
      timeRemaining: outpass.status === "approved" ? 
        Math.max(0, outpass.expectedReturnDate.getTime() - currentTime.getTime()) : 0
    })

  } catch (error) {
    console.error("Today's outpass fetch error:", error)
    res.status(500).json({ message: "Server error fetching today's outpass" })
  }
})



// Helper function to expire old outpasses
async function expireOldOutpasses() {
  try {
    const currentDate = new Date()
    
    // Find all outpasses that should be expired
    const expiredOutpasses = await Outpass.updateMany(
      {
        status: { $in: ["pending", "approved"] },
        $or: [
          // Outpasses where expected return date has passed
          { expectedReturnDate: { $lt: currentDate } },
          // Outpasses from previous days that are still pending/approved
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
    )

    console.log(`Expired ${expiredOutpasses.modifiedCount} old outpasses`)
    return expiredOutpasses.modifiedCount
  } catch (error) {
    console.error("Error expiring old outpasses:", error)
    return 0
  }
}
module.exports = router
