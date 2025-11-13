import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";
export const adminLogin = asyncHandler(async (req, res) => {
  console.log("adminLogin controller called");
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

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "7d" }
    );

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
  console.log("getStudents controller called");
  const students = await User.find({ role: "student", isVerified: true });
  // console.log(students)

  res.status(200).json({ success: true, data: students });
});

export const blockStudent = asyncHandler(async (req, res) => {
  console.log("block students");
  let { studentId } = req.params;
  const student = await User.findOne({ _id: studentId });
  console.log(student);
  student.isBlocked = !student.isBlocked;
  student.save();
  res.status(200).json({ success: true });
});

export const getInstructors = asyncHandler(async (req, res) => {
  console.log("get instructors called");
  const instructor = await Instructor.find({
    role: "instructor",
    isVerified: true,
  });
  console.log(instructor);
  return res.status(200).json({ succes: true, data: instructor });
});

export const blockInstructor = asyncHandler(async (req, res) => {
  console.log("block instructor");
  let { instructorId } = req.params;
  const instructor = await Instructor.findOne({ _id: instructorId });
  console.log(instructor);
  instructor.isBlocked = !instructor.isBlocked;
  instructor.save();
  return res.status(200).json({ success: true });
});

export const getStudentDetails = asyncHandler(async (req, res) => {
  console.log("get student details");
  // console.log(req.params.id)
  let { id } = req.params;
  const student = await User.findOne({ _id: id });
  console.log(student);
  return res.status(200).json({ success: true, data: student });
});

export const getInstructorDetails = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const instructor = await Instructor.findOne({ _id: id })
  return res.status(200).json({success:true,data:instructor})
})