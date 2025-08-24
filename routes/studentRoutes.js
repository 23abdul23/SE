const express = require("express")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

router.get('/profile', authenticate, async (req, res) =>{
    try {

        console.log(req.body)
        
    } catch (error) {
        console.log(error)
        res.status(500)

    }
}) 

module.exports = router
