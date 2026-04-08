import asyncHandler from "express-async-handler";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

const authorize = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role === "guest") {
      throw new AppError("Authorization required", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Allowed roles: ${allowedRoles.join(", ")}`,
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  });
};

export default authorize;
