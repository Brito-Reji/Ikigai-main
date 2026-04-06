import asyncHandler from "express-async-handler";

import {loginAdminService } from "../../services/admin/adminLoginService.js"
import { getInstructorDetailsService, getInstructorsService, getStudentDetailsService, getStudentsService, toggleInstructorBlockService, toggleStudentBlockService } from "../../services/admin/adminService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";



//  Login
export const adminLogin = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginAdminService(req.body);

  res.cookie("refreshToken", refreshToken);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Admin login successful",
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

//  Students
export const getStudents = asyncHandler(async (req, res) => {
  const students = await getStudentsService();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: students,
  });
});

//  Block Student
export const blockStudent = asyncHandler(async (req, res) => {
  await toggleStudentBlockService(req.params.studentId);

  res.status(HTTP_STATUS.OK).json({ success: true });
});

//  Instructors
export const getInstructors = asyncHandler(async (req, res) => {
  const instructors = await getInstructorsService();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: instructors,
  });
});

//  Block Instructor
export const blockInstructor = asyncHandler(async (req, res) => {
  await toggleInstructorBlockService(req.params.instructorId);

  res.status(HTTP_STATUS.OK).json({ success: true });
});

//  Student Details
export const getStudentDetails = asyncHandler(async (req, res) => {
  const student = await getStudentDetailsService(req.params.id);
  console.log(student)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: student,
  });
});

//  Instructor Details
export const getInstructorDetails = asyncHandler(async (req, res) => {
  const instructor = await getInstructorDetailsService(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: instructor,
  });
});
