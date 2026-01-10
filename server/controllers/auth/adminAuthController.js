import asyncHandler from "express-async-handler";
import { adminLoginService } from "../../services/admin/adminLoginService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";



export const adminLogin = asyncHandler(async (req, res) => {
  const { admin, accessToken, refreshToken } = await adminLoginService(
    req.body
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Admin login successful",
    accessToken,
    user: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  });
});




