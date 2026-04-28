import bcrypt from "bcrypt";
import api from "../../config/axiosConfig.js";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { generateUniqueUsername } from "../../utils/generateUniqueUsername.js";
import { AppError } from "../../errors/AppError.js";

export const instructorRegisterService = async data => {
  const { email, username, firstName, lastName, password } = data;

  if (!email || !username || !firstName || !lastName || !password) {
    throw new AppError("Please provide all required fields", HTTP_STATUS.BAD_REQUEST);
  }

  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!nameRegex.test(firstName.trim()) || firstName.trim().length < 2) {
    throw new AppError("First name must contain only letters and at least 2 characters", HTTP_STATUS.BAD_REQUEST);
  }

  if (!nameRegex.test(lastName.trim()) || lastName.trim().length < 2) {
    throw new AppError("Last name must contain only letters and at least 2 characters", HTTP_STATUS.BAD_REQUEST);
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username) || !/[a-zA-Z]/.test(username)) {
    throw new AppError("Username must contain at least one letter", HTTP_STATUS.BAD_REQUEST);
  }

  const isStudent = await User.findOne({ email });
  if (isStudent) {
    throw new AppError("This user is registered as student use another email", HTTP_STATUS.BAD_REQUEST);
  }

  const existingInstructor = await Instructor.findOne({
    $or: [{ email }, { username }],
  });

  if (existingInstructor) {
    throw new AppError("Email or username already exist", HTTP_STATUS.BAD_REQUEST);
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Please provide a valid email address", HTTP_STATUS.BAD_REQUEST);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", HTTP_STATUS.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const defaultAvatar = `https://ui-avatars.com/api/?name=${initials}&background=4f46e5&color=ffffff&size=256&bold=true&rounded=true`;

  await Instructor.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    username,
    firstName,
    lastName,
    role: "instructor",
    profileImageUrl: defaultAvatar,
  });

  const response = await api.post("/auth/send-otp", { email });

  if (!response.data.success) {
    throw new AppError("Failed to send OTP. Try again.",HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }

  return true;
};

export const instructorSigninService = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Please provide email and password",HTTP_STATUS.BAD_REQUEST)
  }

  const instructor = await Instructor.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!instructor) {
    throw new AppError("Invalid email or password",HTTP_STATUS.UNAUTHORIZED)
  }

  if (instructor.authType === "google") {
    throw new AppError("This account was created with Google. Please use Google Sign-In to continue.",HTTP_STATUS.UNAUTHORIZED)
  }

  if (instructor.role !== "instructor") {
    throw new AppError("Access denied. Instructor account required",HTTP_STATUS.FORBIDDEN)
  }

  if (instructor.isBlocked) {
    throw new AppError("You has been block by the admin . Please contact the admin via email",HTTP_STATUS.FORBIDDEN)
  }

  const isPasswordValid = await bcrypt.compare(password, instructor.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password",HTTP_STATUS.UNAUTHORIZED)
  }

  const tokens = generateTokens({
    userId: instructor._id,
    role: instructor.role,
  });

  instructor.refreshToken = tokens.refreshToken;
  await instructor.save({ validateBeforeSave: false });

  return { instructor, ...tokens };
};

export const instructorGoogleAuthService = async token => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.VITE_GOOGLE_ID,
  });

  const { email, name, picture } = ticket.payload;
  const [firstName, ...lastNameArr] = name.split(" ");
  const lastName = lastNameArr.join(" ");
const isStudent = await User.findOne({ email });
  if (isStudent) {
    throw new AppError("This user is registered as student use another email",HTTP_STATUS.BAD_REQUEST)
  }
  let instructor = await Instructor.findOne({ email });

  if (instructor && instructor.role !== "instructor") {
    throw new AppError("User is already registered as instructor. Please use another account",HTTP_STATUS.FORBIDDEN)
  }

  if (!instructor) {
    let username = await generateUniqueUsername(email, "instructor");
    instructor = await Instructor.create({
      email,
      firstName,
      lastName,
      username,
      isVerified: true,
      profileImageUrl: picture,
      authType: "google",
      role: "instructor",
    });
  }

  const tokens = generateTokens({
    userId: instructor._id,
    role: instructor.role,
  });

  instructor.refreshToken = tokens.refreshToken;
  await instructor.save({ validateBeforeSave: false });

  return { instructor, ...tokens };
};
