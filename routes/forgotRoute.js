import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD
    }
});

router.post('/', async (req , res) => {
    try{
        const { email } = req.body;
        const newPassword = Math.random().toString(36).slice(-8); 

        const user = await User.findOne({email});

        if (!user){
            return  res.status(404).json({ message: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        let mailOptions = {
            from: process.env.GMAIL_ID,
            to: email,
            subject: 'Password Reset Request',
            text: `This is your new password: ${newPassword}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    } 
});

export default router;
