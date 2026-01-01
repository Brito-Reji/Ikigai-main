import asyncHandler from "express-async-handler";
import {
  getInstructorProfileSerice,
  updateInstructorProfileService,
  requestEmailChangeOTPService,
  verifyEmailChangeOTPService,
  changePasswordService,
} from "../../services/instructor/profileService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const getInstructorProfile = asyncHandler(async (req, res) => {
  let instructorProfile = getInstructorProfileSerice(req);

  res.status(HTTP_STATUS.OK).json(instructorProfile);
});

export const updateInstructorProfile = asyncHandler(async (req, res) => {
  const updatedinstructorProfile = updateInstructorProfileService(req);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "instuctor profile updated successfuly",
    data: {
      _id: updatedinstructorProfile._id,
      name: updatedinstructorProfile.name,
      email: updatedinstructorProfile.email,
      phone: updatedinstructorProfile.phone,
      bio: updatedinstructorProfile.bio,
      socialLinks: updatedinstructorProfile.socialLinks,
      profileImage: updatedinstructorProfile.profileImage,
      coverImage: updatedinstructorProfile.coverImage,
    },
  });
});

// REQUEST EMAIL CHANGE OTP
export const requestEmailChangeOTP = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "New email and password are required",
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
      message: "Email and OTP are required",
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
      message: "Current password and new password are required",
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
