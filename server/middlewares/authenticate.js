import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";
import { Admin } from "../models/Admin.js";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

const MODELS = {
  student: User,
  admin: Admin,
  instructor: Instructor,
};

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = { role: "guest" };
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      req.user = { role: "guest" };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const Model = MODELS[decoded.role];

    if (!Model) {
      res.status(401);
      throw new AppError("Invalid role", HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await Model.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      throw new AppError("Account is blocked", HTTP_STATUS.FORBIDDEN);
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Handle JWT errors (malformed, expired, etc.) by treating as guest
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      req.user = { role: "guest" };
      return next();
    }
    // Re-throw other errors
    throw error;
  }
});

export default authenticate;
