const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email : {
      type: String,
      require : true 
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    
    role: {
      type: String,
      enum: ["student", "warden", "security"],
      default: "security",
    },
    location : {
      type: String,
      require : true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],      
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    // deviceId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    guardId: {
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

module.exports = mongoose.model("GuardUser", userSchema)