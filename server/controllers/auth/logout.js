import asyncHandler from "express-async-handler";
import { logoutService } from "../../services/auth/logoutService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await logoutService(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Logged out successfully",
  });
});
