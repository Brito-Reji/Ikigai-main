import bcrypt from "bcrypt";

import { generateTokens } from "../../utils/generateTokens.js";
import { Admin } from "../../models/Admin.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";



//  Admin Login
export const loginAdminService = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("All fields are required", HTTP_STATUS.BAD_REQUEST);
  }

  const user = await Admin.findOne({ email });

  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  if (user.role !== "admin") {
    throw new AppError("Access denied", HTTP_STATUS.FORBIDDEN);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = generateTokens({
    userId: user._id,
    role: user.role,
  });

  return {
    user,
    ...tokens,
  };
};

