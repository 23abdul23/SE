const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const WardenUser = require("../models/WardenUser")
const GuardUser = require("../models/GuardUser")
const { authenticate } = require("../middleware/auth");
const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {

    const { name, email, password, Id, guardId, wardenId, hostel, roomNumber, phoneNumber, emergencyContact, deviceId, gender, profilePhoto , role} = req.body
    let user;

    if(role == "student") {
       // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { Id }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or student ID already exists",
      })
    }
       // Create new user
      user = new User({
      name,
      email,
      password: password,
      studentId: Id,
      hostel,
      roomNumber,
      phoneNumber,
      emergencyContact,
      deviceId,
      gender,
      profilePhoto
    })

    }
    else if(role == "warden") {
       // Check if user already exists
    const existingUser = await WardenUser.findOne({
      $or: [{ email }, { Id }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "warden with this email or  ID already exists",
      })
    }
       // Create new user
      user = new WardenUser({
      name,
      email,
      password: password,
      hostel,
      phoneNumber,
      deviceId,
      gender,
      profilePhoto
    })
    }
    else {
       // Create new user
        // Check if user already exists
    const existingUser = await GuardUser.findOne({
      $or: [{ email }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "Guard with this ID already exists",
      })
    }

      user = new GuardUser({
      name,
      email,
      guardId: guardId,
      phoneNumber,
      emergencyContact,
      deviceId,
      gender,
      profilePhoto
    })
    }
   

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})



// Login user
router.post("/login", async (req, res) => {
  try {

    console.log(req.body)
    const { email, password ,role} = req.body

    let user;
    // Find user by email

    if (role == 'student'){
      user = await User.findOne({ email })
    }
    else if (role == 'warden'){
      
      user = await WardenUser.findOne({ email })
    }
    else if (role == 'security'){

      user = await GuardUser.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials Username for Guard" })
      }
    }

    console.log(user)
    
    


    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json({ user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({ message: "Server error fetching profile" })
  }
})

// Update user profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, phoneNumber, emergencyContact, hostel, roomNumber, gender, profilePhoto } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phoneNumber, emergencyContact, hostel, roomNumber, gender, profilePhoto },
      { new: true },
    ).select("-password")

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ message: "Server error updating profile" })
  }
})

module.exports = router
