import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import { Otp } from "../models/Otp.js";
import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";
// import { Users } from "lucide-react";
import { generateTokens } from "./generateTokens.js";


const testAccount = await nodemailer.createTestAccount();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTPToEmail = async email => {
  if (!email) {
    throw new Error("Email is required");
  }

  const otp = generateOTP();
  await Otp.create({ email, otp });
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const mailOptions = {
    from: '"My App" <your-email@gmail.com>',
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2><p>Expires in 2 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);

  return { otp, success: true };
};

// Route handler for sending OTP
export const sentOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const result = await sendOTPToEmail(email);

    res
      .status(200)
      .json({ message: "OTP generated", otp: result.otp, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const verifyOTP = asyncHandler(async (req, res) => {
  let { email, otp } = req.body;
  let data = await Otp.findOne({ otp, email });
  const resl = await User.findOne({ email });
  if (data?.email === email && data?.otp === otp) {
    if (resl) {
      let student = await User.findOneAndUpdate(
        { email },
        { isVerified: true }
      );
      let { accessToken, refreshToken } = generateTokens({
        userId: student._id,
        email: student.email,
        username: student.username,
        firstName: student.firstName,
        role: student.role,
        profileImageUrl: student.profileImageUrl,
        isVerified: true,
      });

      student.refreshToken = refreshToken;
      await student.save({ validateBeforeSave: false });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken,
        user: student,
        success: true,
        message:
          "user verified succesfully Email verified! Redirecting to dashboard...",
      });
    } else {
      let instructor = await Instructor.findOneAndUpdate(
        { email },
        { isVerified: true }
      );
      let { accessToken, refreshToken } = generateTokens({
        userId: instructor._id,
        email: instructor.email,
        username: instructor.username,
        firstName: instructor.firstName,
        role: instructor.role,
        profileImageUrl: instructor.profileImageUrl,
        isVerified: true,
      });

      instructor.refreshToken = refreshToken;
      await instructor.save({ validateBeforeSave: false });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken,
        instructor: instructor,
        success: true,
        message:
          "user verified succesfully Email verified! Redirecting to dashboard...",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incorrect OTP",
    });
  }
});
