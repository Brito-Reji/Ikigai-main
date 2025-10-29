import asyncHandler from 'express-async-handler'
import Otp from '../models/Otp.js'
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
export const sentOTP = asyncHandler(async (req, res) => {
    try {
        console.log("jfhjhh")
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "email is required" });
  
      const otp = generateOTP();
  
      // Save to DB
      await Otp.create({ email, otp });
  
     console.log("hello")
      res.status(200).json({ message: "OTP generated", otp ,success:true}); // ⚠️ Don't send OTP in production!
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })