import bcrypt from "bcrypt";
import api from "../../config/axiosConfig.js";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { generateTokens } from "../../utils/generateTokens.js";


export const instructorRegisterService = async data => {
  const { email, username, firstName, lastName, password } = data;

  if (!email || !username || !firstName || !lastName || !password) {
    throw { status: 400, message: "Please provide all required fields" };
  }

  const isStudent = await User.findOne({ email });
  if (isStudent) {
    throw {
      status: 400,
      message: "This user is registered as student use another email",
    };
  }

  const existingInstructor = await Instructor.findOne({
    $or: [{ email }, { username }],
  });

  if (existingInstructor) {
    throw {
      status: 400,
      message: "Email or username already exist",
    };
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw { status: 400, message: "Please provide a valid email address" };
  }

  if (password.length < 6) {
    throw {
      status: 400,
      message: "Password must be at least 6 characters long",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Instructor.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    username,
    firstName,
    lastName,
    role: "instructor",
  });

  const response = await api.post("/auth/send-otp", { email });

  if (!response.data.success) {
    throw { status: 500, message: "Failed to send OTP. Try again." };
  }

  return true;
};

export const instructorSigninService = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: "Please provide email and password" };
  }

  const instructor = await Instructor.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!instructor) {
    throw { status: 401, message: "Invalid email or password" };
  }

  if (instructor.authType === "google") {
    throw {
      status: 401,
      message:
        "This account was created with Google. Please use Google Sign-In to continue.",
    };
  }

  if (instructor.role !== "instructor") {
    throw {
      status: 403,
      message: "Access denied. Instructor account required",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, instructor.password);

  if (!isPasswordValid) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const tokens = generateTokens({
    userId: instructor._id,
    email: instructor.email,
    username: instructor.username,
    firstName: instructor.firstName,
    role: instructor.role,
    profileImageUrl: instructor.profileImageUrl,
    isVerified: instructor.isVerified,
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

  let instructor = await Instructor.findOne({ email });

  if (instructor && instructor.role !== "instructor") {
    throw {
      status: 403,
      message:
        "User is already registered as instructor. Please use another account",
    };
  }

  if (!instructor) {
    instructor = await Instructor.create({
      email,
      firstName,
      lastName,
      username: null,
      isVerified: true,
      profileImageUrl: picture,
      authType: "google",
      role: "instructor",
    });
  }

  const tokens = generateTokens({
    userId: instructor._id,
    email: instructor.email,
    username: instructor.username,
    firstName: instructor.firstName,
    role: instructor.role,
    profileImageUrl: instructor.profileImageUrl,
    isVerified: instructor.isVerified,
  });

  instructor.refreshToken = tokens.refreshToken;
  await instructor.save({ validateBeforeSave: false });

  return { instructor, ...tokens };
};
