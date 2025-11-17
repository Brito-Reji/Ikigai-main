import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { User } from '../../models/User.js';
import { Instructor } from '../../models/Instructor.js';
import { Otp } from '../../models/Otp.js';
import { sendOTPToEmail } from '../../utils/OTPServices.js';

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email }) || await Instructor.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email",
    });
  }

  await sendOTPToEmail(email);

  return res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

export const verifyForgetPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  let user = await User.findOne({ email });
  let isInstructor = false;

  if (!user) {
    user = await Instructor.findOne({ email });
    isInstructor = true;
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });

  await Otp.deleteMany({ email });

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
    role: isInstructor ? 'instructor' : 'student',
  });
});
