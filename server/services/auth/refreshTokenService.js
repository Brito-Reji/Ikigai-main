import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { Admin } from "../../models/Admin.js";
import { generateTokens } from "../../utils/generateTokens.js";


export const refreshTokenService = async incomingToken => {
  if (!incomingToken) {
    throw {
      status: 403,
      message: "No refresh token provided",
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw {
      status: 403,
      message: "Invalid refresh token",
    };
  }

  const user =
    (await User.findById(decoded.id)) ||
    (await Instructor.findById(decoded.id)) ||
    (await Admin.findById(decoded.id));

  if (!user) {
    throw {
      status: 403,
      message: "User not found",
    };
  }

  if (user.isBlocked) {
    throw {
      status: 403,
      message: "Account is blocked",
    };
  }

  if (user.refreshToken !== incomingToken) {
    throw {
      status: 403,
      message: "Invalid refresh token",
    };
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens({
    userId: user._id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
    isVerified: user.isVerified,
  });

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
