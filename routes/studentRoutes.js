const express = require("express")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router()

router.get('/profile', authenticate, async (req, res) =>{
    try {
        const user = await User.findOne({studentId : req.user.studentId})

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({message: "User Found!", userData : user})

    } 
    catch (error) {
        console.log("Error: ", error)
        res.status(500)
    }
}) 

router.put('/profile', authenticate, async(req, res) => {

    const user = await User.findOne({ studentId: req.user.studentId });

    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    user.phoneNumber = req.body.phone;
    user.roomNumber = req.body.roomNumber;

    await user.save();

    return res.status(200).json({message : "User Data is Updated"})

})

module.exports = router
