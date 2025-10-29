import asyncHandler from 'express-async-handler'
import Otp from '../models/Otp.js'
import { User } from '../models/User.js';
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
  
export const verifyOTP = asyncHandler(async(req, res) => {
  let { email, otp } = req.body
  console.log("req.body->",req.body)
  let data = await Otp.findOne({otp,email})
  console.log(data)
  console.log(email, ":", data?.email, "    ", otp, ":", data?.otp)
  console.log("data from the db ->",data)
  if (data?.email == email && data?.otp == otp) {
    console.log("User verfied");
    await User.findOneAndUpdate({ email }, { isVerfied: true })
    res.status(200).json({
      success: true,
      message:
        "user verified succesfully Email verified! Redirecting to dashboard...",
    })
  } else {
      res.status(400).json({
        success: false,
        message:"Incorrect Otp I guess",
      });
  }

})