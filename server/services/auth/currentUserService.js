import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { Admin } from "../../models/Admin.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const getCurrentUserService = async accessToken => {
  if (!accessToken) {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "No token provided",
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Invalid token",
    };
  }

  let user =
    (await User.findById(decoded.id)) ||
    (await Instructor.findById(decoded.id)) ||
    (await Admin.findById(decoded.id));

  if (!user) {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "User not found",
    };
  }

  if (user.isBlocked) {
    throw {
      status: HTTP_STATUS.FORBIDDEN,
      message: "Your account has been blocked. Please contact support.",
      isBlocked: true,
    };
  }

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
  };
};
