import asyncHandler from "express-async-handler";

const authorize = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.role === "guest") {
      res.status(401);
      throw new Error("Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
      );
    }

    next();
  });
};

export default authorize;
