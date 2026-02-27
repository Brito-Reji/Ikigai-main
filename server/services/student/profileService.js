import { User } from "../../models/User.js";
import { Otp } from "../../models/Otp.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../../utils/emailService.js";

export const getProfileService = async (userId) => {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const updateProfileService = async (userId, updateData) => {
    console.log(updateData)
    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).select("-password -refreshToken");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const requestEmailChangeOTPService = async (userId, newEmail, password) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new Error("User not found");
    }

    if (user.authType !== "email") {
        throw new Error("Cannot change email for Google authenticated users");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error("Invalid password");
        error.statusCode = 401;
        throw error;
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
        const error = new Error("Email already in use");
        error.statusCode = 409;
        throw error;
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
        throw new Error("Invalid OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
        await Otp.findByIdAndDelete(otpRecord._id);
        throw new Error("OTP has expired");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    user.email = newEmail;
    user.isVerified = true;
    await user.save();

    await Otp.findByIdAndDelete(otpRecord._id);

    return { message: "Email updated successfully" };
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
    if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new Error("User not found");
    }

    if (user.authType !== "email") {
        throw new Error("Cannot change password for Google authenticated users");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 401;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password changed successfully" };
};
