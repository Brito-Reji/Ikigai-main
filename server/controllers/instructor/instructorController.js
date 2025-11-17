import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { Instructor } from "../../models/Instructor.js";

import api from "../../config/axiosConfig.js";
import { OAuth2Client } from "google-auth-library";
import { generateTokens } from "../../utils/generateTokens.js";

export const instructorRegister = asyncHandler(async (req, res) => {
  console.log("Instructor registration endpoint hit!");
  console.log("Request body:", req.body);

  let { email, username, firstName, lastName, password } = req.body;

  if (!email || !username || !firstName || !lastName || !password) {
    console.log("Missing required fields");
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }
  const existingUser = await Instructor.findOne({
    $or: [{ email }, { username }],
  });
  console.log(existingUser, " existing user instructor");
  if (existingUser) {
    console.log("user already exist");
    return res
      .status(400)
      .json({ success: false, message: "email or username  already exist" });
  }
  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let role = "instructor";
   await Instructor.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    username,
    firstName,
    lastName,
    role,
  });


  try {
    let response = await api.post("/auth/send-otp", { email });
    if (response.data.success) {
      console.log("AFter sending the Otp", response.data);
      res.status(200).json({ success: true, message: "otp " });
    }
  } catch (err) {
    console.error("OTP API failed:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again." });
  }
});

export const instructorSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // Find user by email
  const user = await Instructor.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  console.log(user);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  if (user.authType == "google") {
    return res.status(401).json({
      success: false,
      message: "This account was created with Google. Please use Google Sign-In to continue.",
    });
  }
  // Check if user is an instructor
  if (user.role !== "instructor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Instructor account required",
    });
  }

  // Verify password
  console.log(
    "password from the from ->",
    password,
    "  hashed password from the db->",
    user.password
  );
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate JWT tokens
  let { accessToken, refreshToken } = generateTokens({
    userId: user._id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
    isVerified: user.isVerified,
  });

  // Store refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    success: true,
    accessToken,
    user: {
      email: user.email,
      role: user.role,
    },
  });
});

export const instructorGoogleAuth = asyncHandler(async (req, res) => {
  const client = new OAuth2Client();
  const { token } = req.body;
  console.log(token);
  const ticket = await client.verifyIdToken({
    idToken: token, // The credential from your frontend
    audience: process.env.VITE_GOOGLE_ID, // Your app's Client ID
  });
  console.log(ticket);
  let { email, name, picture } = ticket.payload;
  console.log("name of the instructor is: ", name);
  let [firstName, ...lastName] = name.split(" ");
  lastName = lastName.join(" ");
  let user = await Instructor.findOne({ email });
  if (user) {
    let { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified,
    });

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } else {
    // Create new instructor account
    user = await Instructor.create({
      email,
      firstName,
      lastName,
      username: null,
      isVerified: true,
      profileImageUrl: picture,
      authType: 'google'
    });

    let { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified,
    });

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  }
});
