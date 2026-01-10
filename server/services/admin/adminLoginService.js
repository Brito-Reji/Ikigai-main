import bcrypt from "bcrypt";

import {Admin} from "../../models/Admin.js"
import {generateTokens} from "../../utils/generateTokens.js"
export const adminLoginService = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "All fields are required" };
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    throw { status: 404, message: "User not found" };
  }

  if (admin.role !== "admin") {
    throw { status: 403, message: "Access denied. Not an admin." };
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
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
