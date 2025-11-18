import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";

export const currentUser = async (req, res) => {
  try {
    // Extract token from Authorization header
    let accessToken = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      accessToken = req.headers.authorization.split(' ')[1];
    }

    if (!accessToken) {
      console.log('No token provided in request');
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    // console.log("Decoded token:", decoded);

    // Check user in database to verify blocked status
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Instructor.findById(decoded.id);
    }

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      console.log('User is blocked:', user.email);
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.',
        isBlocked: true,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
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
    console.log('Token verification error:', err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};