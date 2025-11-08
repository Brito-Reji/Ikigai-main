import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { User } from "../../models/User.js";
import { OAuth2Client } from "google-auth-library";
import { generateTokens } from "../../utils/generateTokens.js";
import { sentOTP } from "../../utils/OTPServices.js";

// import { User } from './model/'

export const studentRegister = asyncHandler(async (req, res) => {
  console.log("Student registration endpoint hit!");
  console.log("Request body:", req.body);

  let { email, username, firstName, lastName, password } = req.body;

  if (!email || !username || !firstName || !lastName || !password) {
    console.log("Missing required fields");
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  console.log(existingUser, " existing user student");
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "email or username  already exist" });

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
  let role = "student";
  let user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    username,
    firstName,
    lastName,
    role,
  });

  await user.save();
  try {
    // Create a mock request object for the OTP service
    const mockReq = { body: { email } };
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 200 && data.success) {
            console.log("After sending the OTP", data);

            let { accessToken, refreshToken } = generateTokens({
              userId: user._id,
              role: user.role,
            });

            // Store refresh token in database
            user.refreshToken = refreshToken;
            user.save({ validateBeforeSave: false });

            // Set refresh token in HttpOnly cookie
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res
              .status(200)
              .json({
                success: true,
                message: "OTP sent successfully",
               
              });
          } else {
            throw new Error(data.message || "Failed to send OTP");
          }
        },
      }),
    };

    // Call the OTP service directly
    await sentOTP(mockReq, mockRes);
  } catch (err) {
    console.error("OTP service failed:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again." });
  }
});

export const studentLogin = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  console.log("login response ->", email);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "fields cannot be empty",
    });
  }
  let user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  })
    .select("+password")
    .exec();

  // Check if user exists
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check if user is verified
  if (!user.isVerfied) {
    try {
      // Create a mock request object for the OTP service
      const mockReq = { body: { email: user.email } };
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            if (code === 200 && data.success) {
              console.log("After sending the OTP", data);
              return res
                .status(200)
                .json({ success: true, message: "OTP sent for verification" });
            } else {
              throw new Error(data.message || "Failed to send OTP");
            }
          },
        }),
      };

      // Call the OTP service directly
      await sentOTP(mockReq, mockRes);
      return; // Exit early since response is handled above
    } catch (err) {
      console.error("OTP service failed:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP. Try again." });
    }
  }
  console.log(user);
  console.log(password, user?.password);
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    if (result) {
      let { accessToken, refreshToken } = generateTokens({
        userId: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        profileImageUrl: user.profileImageUrl,
        isVerified: user.isVerfied,
      });

      // Store refresh token in database
      user.refreshToken = refreshToken;
      user.save({ validateBeforeSave: false });

      // Set refresh token in HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return response in the expected format
      return res.status(200).json({
        success: true,
        accessToken,
        user: {
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const client = new OAuth2Client();
  const { token } = req.body;
  console.log(token);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.VITE_GOOGLE_ID, 
  });
  console.log(ticket);
  let { email, name, picture } = ticket.payload;
  let [firstName, ...lastName] = name.split(" ");
  lastName = lastName.join();
  let user = await User.findOne({ email });
  console.log(!!user);
  if (user) {
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "user is blocked by the admin ",
      });
    }
    let { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerfied,
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
  if (!user) {
    // console.log(lastName.join())
    user = await User.create({
      email,
      firstName,
      lastName,
      username: null,
      isVerfied: true,
      profileImageUrl: picture,
    });
    let { accessToken, refreshToken } = generateTokens({
      userId: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerfied,
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

const studentForgetPassword = asyncHandler(async (req, res) => {});

const studentAddToCart = asyncHandler(async (req, res) => {});
