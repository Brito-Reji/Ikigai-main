import asyncHandler from "express-async-handler";
import { logoutService } from "../../services/auth/logoutService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const logout = asyncHandler(async (req, res) => {
  const studentRefreshToken = req.cookies?.studentRefreshToken;
  const instructorRefreshToken = req.cookies?.instructorRefreshToken;
  const adminRefreshToken = req.cookies?.adminRefreshToken;

  if (studentRefreshToken) await logoutService(studentRefreshToken);
  if (instructorRefreshToken) await logoutService(instructorRefreshToken);
  if (adminRefreshToken) await logoutService(adminRefreshToken);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  };

  res.clearCookie("studentRefreshToken", cookieOptions);
  res.clearCookie("instructorRefreshToken", cookieOptions);
  res.clearCookie("adminRefreshToken", cookieOptions);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Logged out successfully",
  });
});
