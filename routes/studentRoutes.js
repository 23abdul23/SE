import express from "express";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get('/profile', authenticate, async (req, res) =>{
    try {
        const user = await User.findOne({studentId : req.user.studentId});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({message: "User Found!", userData : user});

    } 
    catch (error) {
        console.log("Error: ", error);
        res.status(500);
    }
});

router.put('/profile', authenticate, async(req, res) => {

    const user = await User.findOne({ studentId: req.user.studentId });

    if (!user) {
    return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    user.phoneNumber = req.body.phoneNumber;
    user.roomNumber = req.body.roomNumber;
    user.email = req.body.email;
    user.studentId = req.body.studentId;
    user.hostel = req.body.hostel;
    user.year = req.body.year;
    user.department = req.body.department;

    await user.save();

    return res.status(200).json({message : "User Data is Updated"});

});

router.put('/passwordUpdate', authenticate, async (req, res) => {
    const {confirmPassword, newPassword} = req.body.currentPassword;
    const user = await User.findOne( {studentId : req.user.studentId});
    user.password = newPassword;
    await user.save();
    return res.status(200).json({message: "Password Updated Successfully"});
});

export default router;
