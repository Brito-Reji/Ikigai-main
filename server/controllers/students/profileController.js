import asyncHandler from 'express-async-handler';
import {
  getProfileService,
  updateProfileService,
  requestEmailChangeOTPService,
  verifyEmailChangeOTPService,
  changePasswordService,
} from '../../services/students/profileService.js';
import { HTTP_STATUS } from '../../utils/httpStatus.js';

// GET STUDENT PROFILE
export const getProfile = asyncHandler(async (req, res) => {
  const user = await getProfileService(req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile fetched successfully',
    data: user,
  });
});

// UPDATE STUDENT PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    headline,
    description,
    profileImageUrl,
    social,
    phone,
    address,
  } = req.body;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (headline) updateData.headline = headline;
  if (description) updateData.description = description;
  if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;
  if (social) updateData.social = social;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;

  const user = await updateProfileService(req.user._id, updateData);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

// REQUEST EMAIL CHANGE OTP
export const requestEmailChangeOTP = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'New email and password are required',
    });
  }

  const result = await requestEmailChangeOTPService(
    req.user._id,
    newEmail,
    password
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
  });
});

// VERIFY EMAIL CHANGE OTP
export const verifyEmailChangeOTP = asyncHandler(async (req, res) => {
  const { newEmail, otp } = req.body;

  if (!newEmail || !otp) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Email and OTP are required',
    });
  }

  const result = await verifyEmailChangeOTPService(req.user._id, newEmail, otp);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
  });
});

// CHANGE PASSWORD
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  const result = await changePasswordService(
    req.user._id,
    currentPassword,
    newPassword
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message,
  });
});
