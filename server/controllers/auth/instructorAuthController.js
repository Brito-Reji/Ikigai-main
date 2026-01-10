import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { instructorGoogleAuthService, instructorRegisterService, instructorSigninService } from "../../services/instructor/instructorAuthService.js";


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
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
    user: {
      email: instructor.email,
      role: instructor.role,
    },
  });
});

export const instructorGoogleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const { instructor, accessToken, refreshToken } =
    await instructorGoogleAuthService(token);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
    user: {
      email: instructor.email,
      role: instructor.role,
    },
  });
});
