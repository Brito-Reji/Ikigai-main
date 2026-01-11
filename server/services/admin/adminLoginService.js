import bcrypt from "bcrypt";

import { Admin } from "../../models/Admin.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
export const adminLoginService = async ({ email, password }) => {
  if (!email || !password) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "All fields are required",
    };
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    throw { status: HTTP_STATUS.NOT_FOUND, message: "User not found" };
  }

  if (admin.role !== "admin") {
    throw {
      status: HTTP_STATUS.FORBIDDEN,
      message: "Access denied. Not an admin.",
    };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw { status: HTTP_STATUS.UNAUTHORIZED, message: "Invalid credentials" };
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: admin._id,
    email: admin.email,
    firstName: admin.firstName,
    role: admin.role,
  });

  admin.refreshToken = refreshToken;
  await admin.save();

  return {
    admin,
    accessToken,
    refreshToken,
  };
};
