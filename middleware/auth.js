const { verifyToken } = require("../config/jwt")
const User = require("../models/User")

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.userId).select("-password")
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid token or user not found." })
    }

    req.user = user
    next()
  } catch (error) {
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
