import { AppError } from "../../errors/AppError.js";
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const checkUsernameAvailabilityService = async username => {
  if (!username || username.trim().length < 3) {
    throw new AppError("Username must be least 3 characters",HTTP_STATUS.BAD_REQUEST)

  }

  const normalizedUsername = username.toLowerCase();

  const userExists = await User.findOne({ username: normalizedUsername });
  const instructorExists = await Instructor.findOne({
    username: normalizedUsername,
  });

  if (userExists || instructorExists) {
    return {
      available: false,
      message: "Username is already taken",
    };
  }

  return {
    available: true,
    message: "Username is available",
  };
};
