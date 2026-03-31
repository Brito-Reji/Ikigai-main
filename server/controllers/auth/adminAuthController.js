import asyncHandler from "express-async-handler";
import { loginAdminService } from "../../services/admin/adminLoginService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const adminLogin = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginAdminService(
    req.body
  );

  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const response = {
    success: true,
    message: "Admin login successful",
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
