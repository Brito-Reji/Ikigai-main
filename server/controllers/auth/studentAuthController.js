import asyncHandler from "express-async-handler";
import {
  studentGoogleAuthService,
  studentLoginService,
  studentRegisterService,
} from "../../services/student/studentAuthService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const studentRegister = asyncHandler(async (req, res) => {
  const { refreshToken, message } = await studentRegisterService(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
  });
});

export const studentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await studentLoginService(email, password);

  if (result.otpSent) {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "OTP sent for verification",
    });
  }

  const { user, accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
    user: {
      email: user.email,
      role: user.role,
    },
  });
});

export const studentGoogleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const { user, accessToken, refreshToken } =
    await studentGoogleAuthService(token);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
    user: {
      email: user.email,
      role: user.role,
    },
  });
});
