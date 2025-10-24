const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "warden", "security"],
      default: "student",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],      
    },
    department: {
      type: String,
      enum: ["IT", "IT BI","Electronics"],
    },
    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },
    hostel: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    studentId: {
      type: String,
      sparse: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
