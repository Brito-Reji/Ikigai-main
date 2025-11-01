import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../../models/User.js'
import jwt from 'jsonwebtoken'

import api from '../../config/axiosConfig.js'
import axios from 'axios'

import {OAuth2Client} from 'google-auth-library'
import { generateTokens } from '../../utils/generateTokens.js'


// import { User } from './model/'

export const studentRegister = asyncHandler(async (req, res) => {
  console.log("Student registration endpoint hit!");
  console.log("Request body:", req.body);

  let { email, username, firstName, lastName, password } = req.body;

  if (!email || !username || !firstName || !lastName || !password) {
    console.log("Missing required fields");
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  console.log(existingUser, " existing user student")
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

    let response = await api.post('/auth/send-otp', { email });
    if (response.data.success) {
      console.log("AFter sending the Otp", response.data)
        let { accessToken, refreshToken } = generateTokens({
          userId: user._id,
          role: user.role,
        });
      res.status(200).json({ success: true, message: "otp ",accessToken })
    }

  } catch (err) {
    console.error("OTP API failed:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again.", });
  }


})

export const studentLogin = asyncHandler(async (req, res) => {
  let { email, password } = req.body
  console.log('login response ->', email)
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "fields cannot be empty"
    })
  }
  let user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  }).select('+password').exec()

  if (!user?.isVerfied) {
    let response = await api.post("/auth/send-otp", { email: user.email });
    if (response.data.success) {
      console.log("AFter sending the Otp", response.data)
      return res.status(200).json({ success: true,})
    }
  }
  console.log(user)
  console.log(password,user?.password)
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    let {accessToken,refreshToken} = generateTokens({userId:user._id,role:user.role})
   return res.status(200).json({accessToken})

})

});

export const googleAuth = asyncHandler(async (req, res) => {
  const client = new OAuth2Client()
  const{token}  = req.body;
console.log(token)
    const ticket = await client.verifyIdToken({
      idToken: token, // The credential from your frontend
      audience: process.env.VITE_GOOGLE_ID, // Your app's Client ID
    });
  console.log(ticket)
  let { email, name, picture, } = ticket.payload
  let [firstName, ...lastName] = name.split(' ')
  lastName = lastName.join()
  let user = await User.findOne({ email })
  console.log(!!user)
  if (user) {
    let {accessToken,refreshToken}= generateTokens({userId:user._id,role:user.role})
      return res
        .status(200)
        .json({
          accessToken: accessToken,
          success:true
          });

  }
  if (!user) {
    // console.log(lastName.join())
    let user = await User.insertOne({ email, firstName, lastName, username: null })
        let { accessToken, refreshToken } = generateTokens({
          userId: user._id,
          role: user.role,
        });

    return res.status(200).json({
      accessToken: accessToken,
      success: true,
    });

  }


  

})


const studentForgetPassword = asyncHandler(async (req, res) => { });


const studentAddToCart = asyncHandler(async (req, res) => { });







