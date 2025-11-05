const crypto = require("crypto")
const User = require("../models/User")
const Passkey = require("../models/Passkey")

const generatePasskeyHash = (userId, deviceId, date) => {
  const dateString = date.toISOString().split("T")[0] // YYYY-MM-DD format
  const data = `${userId}${deviceId}${dateString}`
  return crypto.createHash("sha256").update(data).digest("hex")
}

const generateDailyPasskeys = async () => {
  try {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    // Get all active students
    const students = await User.find({
      role: "student",
      isActive: true,
    }).select("_id deviceId")

    

    const passkeyPromises = students.map(async (student) => {
      const hash = generatePasskeyHash(student._id, student.deviceId, today)

      // Check if passkey already exists for today
      const existingPasskey = await Passkey.findOne({
        userId: student._id,
        date: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lt: new Date(today.setHours(23, 59, 59, 999)),
        },
      })

      if (!existingPasskey) {
        return Passkey.create({
          userId: student._id,
          hash,
          date: today,
          expiresAt: tomorrow,
        })
      }
    })

    await Promise.all(passkeyPromises)
    console.log(`Generated passkeys for ${students.length} students`)
  } catch (error) {
    console.error("Error in generateDailyPasskeys:", error)
    throw error
  }
}

const validatePasskey = async (hash, userId) => {
  try {
    const today = new Date()
    const passkey = await Passkey.findOne({
      hash,
      userId,
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999)),
      },
      expiresAt: { $gt: new Date() },
    })

    return !!passkey
  } catch (error) {
    console.error("Error validating passkey:", error)
    return false
  }
}

module.exports = {
  generatePasskeyHash,
  generateDailyPasskeys,
  validatePasskey,
}
