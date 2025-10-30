import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import { User } from '../../models/User.js'
import jwt from 'jsonwebtoken'
import api from '../../config/axiosConfig.js';


export const instructorRegister = asyncHandler(async (req, res) => {
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
  console.log(existingUser, " existing user student");
  if (existingUser) {
    console.log('user already exist')
    return res
      .status(400)
      .json({ success: false, message: "email or username  already exist" });
  }
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
  let role = "instructor";
  let user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    username,
    firstName,
    lastName,
    role,
  });

  await user.save();
  try {
    let response = await api.post("/auth/send-otp", { email });
    if (response.data.success) {
      console.log("AFter sending the Otp", response.data);
      res.status(200).json({ success: true, message: "otp " });
    }
  } catch (err) {
    console.error("OTP API failed:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again." });
  }
});








export const instructorSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if user is an instructor
  if (user.role !== "instructor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Instructor account required",
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400, 
    }
  );

  return res.json({
    success: true,
    message: "Sign in successful",
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileImageUrl: user.profileImageUrl || null,
      },
      token,
    },
  });
});