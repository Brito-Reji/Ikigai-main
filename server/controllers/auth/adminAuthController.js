import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
import { generateTokens } from "../../utils/generateTokens.js";

export const adminLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        if (user.role !== "admin") {
            return res
                .status(403)
                .json({ success: false, message: "Access denied. Not an admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const { accessToken, refreshToken } = generateTokens({
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            role: user.role,
        });
        res.cookie("refreshToken", refreshToken);

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export const getStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: "student", isVerified: true });

    res.status(200).json({ success: true, data: students });
});

export const blockStudent = asyncHandler(async (req, res) => {
    let { studentId } = req.params;
    const student = await User.findOne({ _id: studentId });
    student.isBlocked = !student.isBlocked;
    await student.save();
    res.status(200).json({ success: true });
});

export const getInstructors = asyncHandler(async (req, res) => {
    const instructor = await Instructor.find({
        role: "instructor",
        isVerified: true,
    });
    return res.status(200).json({ success: true, data: instructor });
});

export const blockInstructor = asyncHandler(async (req, res) => {
    let { instructorId } = req.params;
    const instructor = await Instructor.findOne({ _id: instructorId });
    instructor.isBlocked = !instructor.isBlocked;
    await instructor.save();
    return res.status(200).json({ success: true });
});

export const getStudentDetails = asyncHandler(async (req, res) => {
    let { id } = req.params;
    const student = await User.findOne({ _id: id });
    return res.status(200).json({ success: true, data: student });
});

export const getInstructorDetails = asyncHandler(async (req, res) => {
    let { id } = req.params;
    const instructor = await Instructor.findOne({ _id: id });
    return res.status(200).json({ success: true, data: instructor });
});
