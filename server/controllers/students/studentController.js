import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../../models/User.js'
import jwt from 'jsonwebtoken'

import api from '../../config/axiosConfig.js'
import axios from 'axios'
// import { User } from './model/'

export const studentRegister = asyncHandler(async (req, res) => {
  let { email, username, firstName, lastName, password } = req.body;

  if (!email || !username || !firstName || !lastName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all requird fields" });
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  console.log(existingUser," existing user student")
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "email or username  already exist" });

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }
    
     const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let role = "student"
   let user = await User.create({
        email: email.toLowerCase(),
      password: hashedPassword,
        username,
        firstName,
        lastName,
     role,
   })
  
 await user.save()
  try {
   
    let response =await api.post('/auth/send-otp', { email });
    if (response.data.success) {
      console.log("AFter sending the Otp",response.data)
     res.status(200).json({success:true,message:"otp "})
   }
  
} catch (err) {
  console.error("OTP API failed:", err.message);
  return res
    .status(500)
    .json({ success: false, message: "Failed to send OTP. Try again." });
}
 
      
})

const studentLogin = asyncHandler(async (req, res) => { });

const studentForgetPassword = asyncHandler(async (req, res) => { });


const studentAddToCart = asyncHandler(async (req, res) => { });

const verifyOtp = asyncHandler((req, res) => {
    
})





