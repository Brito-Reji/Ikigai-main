import bcrypt from "bcrypt";

import { generateTokens } from "../../utils/generateTokens.js";
import { Admin } from "../../models/Admin.js";



//  Admin Login
export const loginAdminService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await Admin.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "admin") {
    throw new Error("Access denied");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
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

