const { verifyToken } = require("../config/jwt")
const User = require("../models/User")
const GuardUser = require("../models/GuardUser")
const WardenUser = require("../models/WardenUser")

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = verifyToken(token)

    let user
    switch (decoded.role) {
      case "security":
        user = await GuardUser.findById(decoded.userId).select("-password")
        break
      case "warden":
        user = await WardenUser.findById(decoded.userId).select("-password")
        break
      default:
        user = await User.findById(decoded.userId).select("-password")
        break
    }

    if (!user || (typeof user.isActive === "boolean" && !user.isActive)) {
      return res.status(401).json({ message: "Invalid token or user not found." })
    }

    req.user = {
      ...user.toObject(),
      role: decoded.role || user.role,
    }
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Invalid token." })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Access denied. Please authenticate." })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    next()
  }
}

module.exports = {
  authenticate,
  authorize,
}
