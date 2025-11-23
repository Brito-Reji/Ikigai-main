import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {User} from "../models/User.js"; // generic user model

export const protect = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find user based on decoded.role
    console.log("Decoded role:", decoded);

    let user = await User.findById(decoded.id);
    console.log("User:", user);

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.isBlocked) {
        return res.status(403).json({ message: "Account is blocked" });
    }

    req.user = {
        id: decoded.id,
        role: decoded.role,
    };

    next();
});
