import Outpass from "../models/Outpass.js";

// Middleware to automatically check and expire old outpasses
export const checkOutpassExpiry = async (req, res, next) => {
  try {
    const currentDate = new Date();
    
    // Update expired outpasses in the background
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
          status: "expired"
        },
        $push: {
          auditTrail: {
            status: "expired",
            changedBy: null,
            changedAt: currentDate,
            remarks: "Auto-expired due to time limit"
          }
        }
      }
    );

    // Log if any outpasses were expired (optional, can be commented out in production)
    if (expiredOutpasses.modifiedCount > 0) {
      console.log(`Auto-expired ${expiredOutpasses.modifiedCount} outpasses at ${currentDate}`);
    }

    next();
  } catch (error) {
    console.error("Error in outpass expiry middleware:", error);
    // Don't fail the request if expiry check fails, just log and continue
    next();
  }
};
