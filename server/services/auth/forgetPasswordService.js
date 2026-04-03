import bcrypt from "bcrypt";
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import { sendOTPToEmail } from "../../utils/OTPServices.js";
import { Otp } from "../../models/Otp.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { AppError } from "../../errors/AppError.js";

export const forgetPasswordService = async email => {
  if (!email) {
    throw new AppError("Email is required",HTTP_STATUS.BAD_REQUEST)
  }

  const user =
    (await User.findOne({ email })) || (await Instructor.findOne({ email }));

  if (!user) {
    throw new AppError("No account found with this email",HTTP_STATUS.NOT_FOUND)
  }

  if (user.isBlocked) {
    throw new AppError("The user is blocked please contact the admin for more info",HTTP_STATUS.FORBIDDEN)
  }

  await sendOTPToEmail(email);

  return true;
};

export const verifyForgetPasswordOtpService = async (email, otp) => {
  if (!email || !otp) {
    throw new AppError("Email and OTP are required",HTTP_STATUS.BAD_REQUEST)
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    throw new AppError("Invalid or expired OTP",HTTP_STATUS.BAD_REQUEST)
  }

  return true;
};

export const resetPasswordService = async (email, otp, newPassword) => {
  if (!email || !otp || !newPassword) {
    throw new AppError("Email, OTP, and new password are required",HTTP_STATUS.BAD_REQUEST)
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters long",HTTP_STATUS.BAD_REQUEST)
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    throw new AppError("Invalid or expired OTP",HTTP_STATUS.BAD_REQUEST)
  }

  let user = await User.findOne({ email });
  let role = "student";

  if (!user) {
    user = await Instructor.findOne({ email });
    role = "instructor";
  }

  if (!user) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: "User not found",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });

  await Otp.deleteMany({ email });

  return role;
};
