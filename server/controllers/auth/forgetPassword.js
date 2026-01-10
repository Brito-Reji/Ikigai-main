import asyncHandler from "express-async-handler";
import { forgetPasswordService, resetPasswordService, verifyForgetPasswordOtpService } from "../../services/auth/forgetPasswordService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";


export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await forgetPasswordService(email);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "OTP sent to your email",
  });
});

export const verifyForgetPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyForgetPasswordOtpService(email, otp);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "OTP verified successfully",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const role = await resetPasswordService(email, otp, newPassword);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Password reset successfully",
    role,
  });
});
