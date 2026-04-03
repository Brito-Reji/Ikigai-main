import { Instructor } from "../../models/Instructor.js";
import { Otp } from "../../models/Otp.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../../utils/emailService.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const getProfileService = async (userId) => {
    const user = await Instructor.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new AppError("User not found",HTTP_STATUS.NOT_FOUND);
    }

    return user;
};

export const updateProfileService = async (userId, updateData) => {
    const user = await Instructor.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).select("-password -refreshToken");

    if (!user) {
        throw new AppError("User not found",HTTP_STATUS.NOT_FOUND);
    }

    return user;
};

export const requestEmailChangeOTPService = async (userId, newEmail, password) => {
    const user = await Instructor.findById(userId).select("+password");

    if (!user) {
        throw new AppError("User not found",HTTP_STATUS.NOT_FOUND);
    }

    if (user.authType !== "email") {
        throw new AppError("Cannot change email for Google authenticated users",HTTP_STATUS.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid password",HTTP_STATUS.UNAUTHORIZED);
    }

    const emailExists = await Instructor.findOne({ email: newEmail });
    if (emailExists) {
        throw new AppError("Email already in use",HTTP_STATUS.CONFLICT);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndDelete({ email: newEmail });
    await Otp.create({
        email: newEmail,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(newEmail, otp);

    return { message: "OTP sent to new email address" };
};

export const verifyEmailChangeOTPService = async (userId, newEmail, otp) => {
    const otpRecord = await Otp.findOne({ email: newEmail, otp });

    if (!otpRecord) {
        throw new AppError("Invalid OTP",HTTP_STATUS.BAD_REQUEST);
    }

    if (otpRecord.expiresAt < new Date()) {
        await Otp.findByIdAndDelete(otpRecord._id);
        throw new AppError("OTP has expired",HTTP_STATUS.BAD_REQUEST);
    }

    const user = await Instructor.findById(userId);

    if (!user) {
        throw new AppError("User not found",HTTP_STATUS.NOT_FOUND);
    }

    user.email = newEmail;
    user.isVerified = true;
    await user.save();

    await Otp.findByIdAndDelete(otpRecord._id);

    return { message: "Email updated successfully" };
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
    if (newPassword.length < 6) {
        throw new AppError("New password must be at least 6 characters long",HTTP_STATUS.BAD_REQUEST);
    }

    const user = await Instructor.findById(userId).select("+password");

    if (!user) {
        throw new AppError("User not found",HTTP_STATUS.NOT_FOUND);
    }

    if (user.authType !== "email") {
        throw new AppError("Cannot change password for Google authenticated users",HTTP_STATUS.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError("Current password is incorrect",HTTP_STATUS.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password changed successfully" };
};
