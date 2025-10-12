import User from "../models/User.js"

const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Get user details to check role
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "security") {
      return res.status(403).json({ message: "Admin access required" })
    }

    // Add user role to request for further use
    req.user.role = user.role
    next()
  } catch (error) {
    console.error("Admin auth error:", error)
    res.status(500).json({ message: "Server error in admin authentication" })
  }
}

export { adminAuth }