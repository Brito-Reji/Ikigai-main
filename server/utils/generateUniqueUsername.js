import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";
export const generateUniqueUsername = async (email,role) => {
  let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");

  let isUnique = false;
  let finalUsername = baseUsername;
  let counter = 1;

  while (!isUnique) {
    let existingUser;
    if (role === "student") {
       existingUser = await User.findOne({ username: finalUsername,role });
    } else if (role === "instructor") {
       existingUser = await Instructor.findOne({ username: finalUsername,role });
    }
    if (!existingUser) {
      isUnique = true;
    } else {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }
  }

  return finalUsername;
};