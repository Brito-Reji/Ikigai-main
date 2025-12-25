import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../../utils/generateTokens.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const refreshToken = async (req, res) => {
  try {
    const incomingToken =
      req.cookies?.refreshToken ||
      req.headers["x-refresh-token"] ||
      req.query.refreshToken;

    if (!incomingToken) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, message: "No refresh token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Try to find user in both User and Instructor collections
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Instructor.findById(decoded.id);
    }

    if (!user) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, message: "User not found" });
    }

    if (user.isBlocked) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, message: "Account is blocked" });
    }

    // Check if the refresh token matches the one stored in the database
    if (user.refreshToken !== incomingToken) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified,
    });

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(HTTP_STATUS.OK).json({ success: true, accessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error" });
  }
};
