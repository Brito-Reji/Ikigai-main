import bcrypt from "bcrypt";

import { OAuth2Client } from "google-auth-library";
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import { sendOTPToEmail } from "../../utils/OTPServices.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { generateUniqueUsername } from "../../utils/generateUniqueUsername.js";

export const studentRegisterService = async data => {
  const { email, username, firstName, lastName, password } = data;

  if (!email || !username || !firstName || !lastName || !password) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Please provide all required fields",
    };
  }

  const isInstructor = await Instructor.findOne({ email });
  if (isInstructor) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "This user is registered as instructor use another email",
    };
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser && existingUser.isVerified) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Email or username already exists",
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
  let user;

  if (existingUser && !existingUser.isVerified) {
    existingUser.username = username;
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.password = hashedPassword;
    existingUser.role = "student";
    user = await existingUser.save();
  } else {
    user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      username,
      firstName,
      lastName,
      role: "student",
    });
  }

  await sendOTPToEmail(email);

  const { refreshToken } = generateTokens({
    userId: user._id,
    role: user.role,
  });

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    refreshToken,
    message: existingUser
      ? "Unverified account updated, OTP sent again"
      : "OTP sent successfully",
  };
};

export const studentLoginService = async (email, password) => {
  if (!email || !password) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Fields cannot be empty",
    };
  }

  const user = await User.findOne({
    $or: [{ email }, { username: email }],
  }).select("+password");

  if (!user) {
    throw { status: HTTP_STATUS.UNAUTHORIZED, message: "Invalid credentials" };
  }

  if (user.isBlocked) {
    throw { status: HTTP_STATUS.FORBIDDEN, message: "the user is blocked" };
  }

  if (user.authType === "google") {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message:
        "This account was created with Google. Please use Google Sign-In to continue.",
    };
  }

  if (!user.isVerified) {
    await sendOTPToEmail(user.email);
    return { otpSent: true };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { status: HTTP_STATUS.UNAUTHORIZED, message: "Invalid credentials" };
  }

  const tokens = generateTokens({
    userId: user._id,
    role: user.role,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    profileImageUrl: user.profileImageUrl,
    isVerified: user.isVerified,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, ...tokens };
};

export const studentGoogleAuthService = async token => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.VITE_GOOGLE_ID,
  });

  const { email, name, picture } = ticket.payload;
  const [firstName, ...lastNameArr] = name.split(" ");
  const lastName = lastNameArr.join(" ");

  let user = await User.findOne({ email });

  if (user) {
    if (user.isBlocked) {
      throw {
        status: HTTP_STATUS.FORBIDDEN,
        message: "User is blocked by the admin",
      };
    }

    if (user.role !== "student") {
      throw {
        status: HTTP_STATUS.FORBIDDEN,
        message:
          "User is already registered with another role. Please use another account",
      };
    }

    let needUpdate = false;
    if (user.firstName !== firstName) {
      user.firstName = firstName;
      needUpdate = true;
    }
    if (user.lastName !== lastName) {
      user.lastName = lastName;
      needUpdate = true;
    }
    if (user.profileImageUrl !== picture) {
      user.profileImageUrl = picture;
      needUpdate = true;
    }
    if (needUpdate) {
      await user.save();
    }
  } else {
    let username = await generateUniqueUsername(email,"student");
    user = await User.create({
      email,
      firstName,
      lastName,
      username,
      isVerified: true,
      profileImageUrl: picture,
      authType: "google",
      role: "student",
    });
  }

  const tokens = generateTokens({
    userId: user._id,
    role: user.role,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    profileImageUrl: user.profileImageUrl,
    isVerified: user.isVerified,
  });

  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, ...tokens };
};
