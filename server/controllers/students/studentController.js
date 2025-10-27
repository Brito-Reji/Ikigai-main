import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../../models/User.js'
import jwt from 'jsonwebtoken'
// import { User } from './model/'

export const studentRegister = asyncHandler(async (req, res) => {
  let { email, username, firstName, lastName, password } = req.body;
console.log(req.body)
  if (!email || !username || !firstName || !lastName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all requird fields" });
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  console.log(existingUser," student")
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
        role
    })
  
  let token = jwt.sign(
    {
      id :user.id,
      email,
      username,
      role
    },
    process.env.JWT_SECRET
    , {
    expiresIn:86400
    });
  res.cookie('authToken', token, {
    httpOnly: true,
    
  })
  return res.json({
    success: true,
    message: "Account created successfully",
    data: {
      user: {

        email,
        username,
        firstName,
        lastName,
        role,
        profileImageUrl: null,
        
      },
  token
    },
  });
    
    
})

const studentLogin = asyncHandler(async (req, res) => { });

const studentForgetPassword = asyncHandler(async (req, res) => { });


const studentAddToCart = asyncHandler(async (req, res) => { });

const verifyOtp = asyncHandler((req, res) => {
    
})





