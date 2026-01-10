import asyncHandler from "express-async-handler";
import { refreshTokenService } from "../../services/auth/refreshTokenService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const refreshToken = asyncHandler(async (req, res) => {
  const incomingToken =
    req.cookies?.refreshToken ||
    req.headers["x-refresh-token"] ||
    req.query.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshTokenService(incomingToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
  });
});
