import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const currentUser = async (req, res) => {
  try {
    // Extract token from Authorization header
    let accessToken = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    }

    if (!accessToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    // Check user in database to verify blocked status
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Instructor.findById(decoded.id);
    }

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
        isBlocked: true,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Invalid token" });
  }
};
