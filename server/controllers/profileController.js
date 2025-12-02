import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";

// GET CURRENT USER PROFILE
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    let user;
    if (userRole === "instructor") {
        user = await Instructor.findById(userId).select("-password -refreshToken");
    } else {
        user = await User.findById(userId).select("-password -refreshToken");
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: user,
    });
});

// UPDATE USER PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { firstName, lastName, headline, description, profileImageUrl, social, phone, address } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (headline) updateData.headline = headline;
    if (description) updateData.description = description;
    if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;
    if (social) updateData.social = social;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    let user;
    if (userRole === "instructor") {
        user = await Instructor.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password -refreshToken");
    } else {
        user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password -refreshToken");
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
    });
});

// REQUEST EMAIL CHANGE OTP
export const requestEmailChangeOTP = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
        return res.status(400).json({
            success: false,
            message: "New email and password are required",
        });
    }

    let user;
    if (userRole === "instructor") {
        user = await Instructor.findById(userId).select("+password");
    } else {
        user = await User.findById(userId).select("+password");
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    if (user.authType !== "email") {
        return res.status(400).json({
            success: false,
            message: "Cannot change email for Google authenticated users",
        });
    }

    const bcrypt = await import("bcrypt");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        });
    }

    const Model = userRole === "instructor" ? Instructor : User;
    const emailExists = await Model.findOne({ email: newEmail });
    if (emailExists) {
        return res.status(409).json({
            success: false,
            message: "Email already in use",
        });
    }

    // Generate OTP
    const { Otp } = await import("../models/Otp.js");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndDelete({ email: newEmail });
    await Otp.create({
        email: newEmail,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP email
    const { sendOtpEmail } = await import("../utils/emailService.js");
    await sendOtpEmail(newEmail, otp);

    res.status(200).json({
        success: true,
        message: "OTP sent to new email address",
    });
});

// VERIFY EMAIL CHANGE OTP
export const verifyEmailChangeOTP = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { newEmail, otp } = req.body;

    if (!newEmail || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required",
        });
    }

    const { Otp } = await import("../models/Otp.js");
    const otpRecord = await Otp.findOne({ email: newEmail, otp });

    if (!otpRecord) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        });
    }

    if (otpRecord.expiresAt < new Date()) {
        await Otp.findByIdAndDelete(otpRecord._id);
        return res.status(400).json({
            success: false,
            message: "OTP has expired",
        });
    }

    let user;
    if (userRole === "instructor") {
        user = await Instructor.findById(userId);
    } else {
        user = await User.findById(userId);
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    user.email = newEmail;
    user.isVerified = true;
    await user.save();

    await Otp.findByIdAndDelete(otpRecord._id);

    res.status(200).json({
        success: true,
        message: "Email updated successfully",
    });
});

// CHANGE PASSWORD
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Current password and new password are required",
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "New password must be at least 6 characters long",
        });
    }

    let user;
    if (userRole === "instructor") {
        user = await Instructor.findById(userId).select("+password");
    } else {
        user = await User.findById(userId).select("+password");
    }

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    if (user.authType !== "email") {
        return res.status(400).json({
            success: false,
            message: "Cannot change password for Google authenticated users",
        });
    }

    const bcrypt = await import("bcrypt");
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Current password is incorrect",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});
