import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {User} from "../models/User.js";
import { Instructor } from "../models/Instructor.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Allow guest access (no token)
  if (!authHeader) {
    req.user = { role: "guest" };
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

   let user;

    if (decoded.role === "student" || decoded.role === "admin") {
      user = await User.findById(decoded.id).select("-password");
    } else if (decoded.role === "instructor") {
      user = await Instructor.findById(decoded.id).select("-password");
    }
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    if (user.isBlocked) {
      res.status(403);
      throw new Error("Account is blocked");
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired token",error);
  }
});

export default authenticate;
