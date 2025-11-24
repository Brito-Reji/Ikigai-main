import asyncHandler from "express-async-handler";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";

export const checkUsernameAvailabilty = asyncHandler(async (req, res) => {
  try {
    const { username } = req.query;

    // Check if username is provided
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }

    // Check in both User and Instructor collections
    const userExists = await User.findOne({ username: username.toLowerCase() });
    const instructorExists = await Instructor.findOne({ username: username.toLowerCase() });

    if (userExists || instructorExists) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Username is already taken",
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking username availability",
    });
  }
})



