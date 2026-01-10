import bcrypt from "bcrypt";
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import { sendOTPToEmail } from "../../utils/OTPServices.js";
import { Otp } from "../../models/Otp.js";


export const forgetPasswordService = async email => {
  if (!email) {
    throw {
      status: 400,
      message: "Email is required",
    };
  }

  const user =
    (await User.findOne({ email })) || (await Instructor.findOne({ email }));

  if (!user) {
    throw {
      status: 404,
      message: "No account found with this email",
    };
  }

  if (user.isBlocked) {
    throw {
      status: 400,
      message: "The user is blocked please contact the admin for more info",
    };
  }

  await sendOTPToEmail(email);

  return true;
};

export const verifyForgetPasswordOtpService = async (email, otp) => {
  if (!email || !otp) {
    throw {
      status: 400,
      message: "Email and OTP are required",
    };
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    throw {
      status: 400,
      message: "Invalid or expired OTP",
    };
  }

  return true;
};

export const resetPasswordService = async (email, otp, newPassword) => {
  if (!email || !otp || !newPassword) {
    throw {
      status: 400,
      message: "Email, OTP, and new password are required",
    };
  }

  if (newPassword.length < 6) {
    throw {
      status: 400,
      message: "Password must be at least 6 characters long",
    };
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    throw {
      status: 400,
      message: "Invalid or expired OTP",
    };
  }

  let user = await User.findOne({ email });
  let role = "student";

  if (!user) {
    user = await Instructor.findOne({ email });
    role = "instructor";
  }

  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });

  await Otp.deleteMany({ email });

  return role;
};
