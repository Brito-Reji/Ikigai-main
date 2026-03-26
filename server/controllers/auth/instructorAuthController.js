import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import {
  instructorGoogleAuthService,
  instructorRegisterService,
  instructorSigninService,
} from "../../services/instructor/instructorAuthService.js";

export const instructorRegister = asyncHandler(async (req, res) => {
  await instructorRegisterService(req.body);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "OTP sent successfully",
  });
});

export const instructorSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { instructor, accessToken, refreshToken } =
    await instructorSigninService(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const response = {
    success: true,
    accessToken,
    user: {
      _id: instructor._id,
      email: instructor.email,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      username: instructor.username,
      role: instructor.role,
      profileImageUrl: instructor.profileImageUrl,
    },
  };

  // In development, include refreshToken in response since cookies may not work
  if (process.env.NODE_ENV === "development") {
    response.refreshToken = refreshToken;
  }

  res.status(HTTP_STATUS.OK).json(response);
});

export const instructorGoogleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const { instructor, accessToken, refreshToken } =
    await instructorGoogleAuthService(token);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const response = {
    success: true,
    accessToken,
    user: {
      _id: instructor._id,
      email: instructor.email,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      username: instructor.username,
      role: instructor.role,
      profileImageUrl: instructor.profileImageUrl,
    },
  };

  // In development, include refreshToken in response since cookies may not work
  if (process.env.NODE_ENV === "development") {
    response.refreshToken = refreshToken;
  }

  res.status(HTTP_STATUS.OK).json(response);
});
