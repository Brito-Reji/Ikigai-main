import asyncHandler from "express-async-handler";
import { Otp } from "../models/Otp.js";
import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";
import { generateTokens } from "./generateTokens.js";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "./httpStatus.js";
import { sendOtpEmail } from "./emailService.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTPToEmail = async (email) => {
  if (!email) {
    throw new AppError("Email is required", HTTP_STATUS.BAD_REQUEST);
  }

  const otp = generateOTP();

  // Send email first to avoid orphaned OTPs in DB
  const result = await sendOtpEmail(email, otp);

  if (result.success) {
    // Only persist if email send was successful
    await Otp.create({ email, otp });
  }

  return result;
};

// Route handler for sending OTP
export const sentOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Email is required",
      data: null,
    });
  }

  const result = await sendOTPToEmail(email);

  if (!result.success) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: result.message || "Failed to send OTP",
      data: null,
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "OTP sent successfully",
    data: null, // Removed otp from response for security
  });
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
        role: student.role,
      });

      student.refreshToken = refreshToken;
      await student.save({ validateBeforeSave: false });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: {
          accessToken,
          user: student
        }
      });
    } else {
      let instructor = await Instructor.findOneAndUpdate(
        { email },
        { isVerified: true }
      );
      let { accessToken, refreshToken } = generateTokens({
        userId: instructor._id,
        role: instructor.role,
      });

      instructor.refreshToken = refreshToken;
      await instructor.save({ validateBeforeSave: false });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: {
          accessToken,
          user: {
            _id: instructor._id,
            email: instructor.email,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            username: instructor.username,
            role: instructor.role,
            profileImageUrl: instructor.profileImageUrl,
          }
        }
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incorrect OTP",
      data: null
    });
  }
});

