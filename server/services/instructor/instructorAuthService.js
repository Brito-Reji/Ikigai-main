import bcrypt from "bcrypt";
import api from "../../config/axiosConfig.js";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { generateUniqueUsername } from "../../utils/generateUniqueUsername.js";

export const instructorRegisterService = async data => {
  const { email, username, firstName, lastName, password } = data;

  if (!email || !username || !firstName || !lastName || !password) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Please provide all required fields",
    };
  }

  const isStudent = await User.findOne({ email });
  if (isStudent) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "This user is registered as student use another email",
    };
  }

  const existingInstructor = await Instructor.findOne({
    $or: [{ email }, { username }],
  });

  if (existingInstructor) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Email or username already exist",
    };
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Please provide a valid email address",
    };
  }

  if (password.length < 6) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
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
    throw {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Failed to send OTP. Try again.",
    };
  }

  return true;
};

export const instructorSigninService = async (email, password) => {
  if (!email || !password) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Please provide email and password",
    };
  }

  const instructor = await Instructor.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!instructor) {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Invalid email or password",
    };
  }

  if (instructor.authType === "google") {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message:
        "This account was created with Google. Please use Google Sign-In to continue.",
    };
  }

  if (instructor.role !== "instructor") {
    throw {
      status: HTTP_STATUS.FORBIDDEN,
      message: "Access denied. Instructor account required",
    };
  }

  if (instructor.isBlocked) {
    throw {
      status: HTTP_STATUS.FORBIDDEN,
      message:"You has been block by the admin . Please contact the admin via email"
    }
  }

  const isPasswordValid = await bcrypt.compare(password, instructor.password);

  if (!isPasswordValid) {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Invalid email or password",
    };
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
      status: HTTP_STATUS.FORBIDDEN,
      message:
        "User is already registered as instructor. Please use another account",
    };
  }

  if (!instructor) {
    let username = await generateUniqueUsername(email,"instructor");
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
