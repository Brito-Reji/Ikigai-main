import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from 'express-async-handler'
import { User } from "../../models/User.js";
export const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Not an admin." });
    }

    // Compare password
      const isMatch = await bcrypt.compare(password, user.password, (err,value) => {
        console.log(value)
    });
  
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
})
