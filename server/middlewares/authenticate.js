


import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";
import { Admin } from "../models/Admin.js";

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

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  const Model = MODELS[decoded.role];

  if (!Model) {
    res.status(401);
    throw new Error("Invalid role");
  }

  const user = await Model.findById(decoded.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error("Account is blocked");
  }

  req.user = {
    _id: user._id,
    email: user.email,
    role: decoded.role,
  };

  next();
});

export default authenticate;
