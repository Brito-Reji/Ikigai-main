import asyncHandler from "express-async-handler";
import { refreshTokenService } from "../../services/auth/refreshTokenService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const studentRefreshToken = asyncHandler(async (req, res) => {
  const incomingToken =
    req.cookies?.studentRefreshToken ||
    req.headers["x-refresh-token"] ||
    req.query.refreshToken ||
    req.body.refreshToken;

  if (!incomingToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "No refresh token" });
    return;
  }

  const result = await refreshTokenService(incomingToken);

  res.cookie("studentRefreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken: result.accessToken,
  });
});

export const instructorRefreshToken = asyncHandler(async (req, res) => {
  const incomingToken =
    req.cookies?.instructorRefreshToken ||
    req.headers["x-refresh-token"] ||
    req.query.refreshToken ||
    req.body.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshTokenService(incomingToken);

  res.cookie("instructorRefreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
  });
});

export const adminRefreshToken = asyncHandler(async (req, res) => {
  const incomingToken =
    req.cookies?.adminRefreshToken ||
    req.headers["x-refresh-token"] ||
    req.query.refreshToken ||
    req.body.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshTokenService(incomingToken);

  res.cookie("adminRefreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    accessToken,
  });
});
