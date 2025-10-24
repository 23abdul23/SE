const nodemailer = require('nodemailer');
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require("crypto")
const dotenv = require("dotenv")
const router = express.Router();

dotenv.config()

             // Nodemailer Transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD
    }
})

router.post('/', async (req , res) => {

    try{
        const { email } = req.body;
        const newPassword = Math.random().toString(36).slice(-8); 

        const user = await User.findOne({email})

        if (!user){
            return  res.status(404).json({ message: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();
                                   // "Forgot Password Route"
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Note: We send a 200 OK message even if user isn't found
      // This prevents attackers from "guessing" which emails are registered.
      return res.status(200).json({ message: 'If your email is registered, you will receive a reset link.' });
    }

    // 1. Generate a secure, random token
    const token = crypto.randomBytes(32).toString('hex');

    // 2. Save the token and its expiration date (1 hour) to the user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    // 3. Create the reset link
    // This MUST point to your frontend app's deep link.
    // Make sure your app is configured to open 'aegisid://'
    const resetURL = `aegisid://reset-password/${token}`;

    // 4. Send the email
    const mailOptions = {
      from: process.env.GMAIL_ID,
      to: user.email,
      subject: 'Aegis ID Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste it into your browser to complete the process:\n\n` +
            `${resetURL}\n\n` +
            `This link will expire in one hour.\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent. Please check your inbox.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

                                   //"Reset Password Route"

router.post('/reset/:token', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    // 1. Find the user by the token AND check if it's expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Check if expiry date is greater than now
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;