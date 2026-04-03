import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { Admin } from "../../models/Admin.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { AppError } from "../../errors/AppError.js";

export const refreshTokenService = async incomingToken => {
  if (!incomingToken) {
    throw new AppError("No refresh token provided",HTTP_STATUS.FORBIDDEN)
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid refresh token",HTTP_STATUS.FORBIDDEN)
  }

  const user =
    (await User.findById(decoded.id)) ||
    (await Instructor.findById(decoded.id)) ||
    (await Admin.findById(decoded.id));

  if (!user) {
    throw new AppError("User not found",HTTP_STATUS.FORBIDDEN)
  }

  if (user.isBlocked) {
    throw new AppError("Account is blocked",HTTP_STATUS.FORBIDDEN)
  }

  if (user.refreshToken !== incomingToken) {
    throw new AppError("Invalid refresh token",HTTP_STATUS.FORBIDDEN)
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens({
    userId: user._id,
    role: user.role,
  });

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
