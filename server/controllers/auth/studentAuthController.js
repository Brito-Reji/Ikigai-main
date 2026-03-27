import asyncHandler from "express-async-handler";
import {
  studentGoogleAuthService,
  studentLoginService,
  studentRegisterService,
} from "../../services/student/studentAuthService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const studentRegister = asyncHandler(async (req, res) => {
  const { refreshToken, message } = await studentRegisterService(req.body);

  res.cookie("studentRefreshToken", refreshToken, {
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

  res.cookie("studentRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const response = {
    success: true,
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };

  // In development, include refreshToken in response since cookies may not work
  if (process.env.NODE_ENV === "development") {
    response.refreshToken = refreshToken;
  }

  res.status(HTTP_STATUS.OK).json(response);
});

export const studentGoogleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const { user, accessToken, refreshToken } =
    await studentGoogleAuthService(token);

  res.cookie("studentRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const response = {
    success: true,
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };

  // In development, include refreshToken in response since cookies may not work
  if (process.env.NODE_ENV === "development") {
    response.refreshToken = refreshToken;
  }

  res.status(HTTP_STATUS.OK).json(response);
});
