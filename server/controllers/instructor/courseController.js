import asyncHandler from "express-async-handler";
import {
  getAllCourseByInstructorService,
  createCourseService,
  updateCourseService,
  getCourseByIdService
} from "../../services/instructor/courseService.js";

// GET ALL COURSES OF INSTRUCTOR
export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  const courses = await getAllCourseByInstructorService(instructorId);

  res.status(200).json({
    success: true,
    message: "COURSES FETCHED SUCCESSFULLY",
    data: courses,
  });
});

// CREATE NEW COURSE
export const createCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  const course = await createCourseService(instructorId, req.body);

  res.status(201).json({
    success: true,
    message: "COURSE CREATED SUCCESSFULLY",
    data: course,
  });
});

// UPDATE EXISTING COURSE
export const updateCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const { courseId } = req.params;

  const updatedCourse = await updateCourseService(courseId, instructorId, req.body);

  res.status(200).json({
    success: true,
    message: "COURSE UPDATED SUCCESSFULLY",
    data: updatedCourse,
  });
});

// GET COURSE BY ID
export const getCourseById = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const { courseId } = req.params;

  const course = await getCourseByIdService(courseId, instructorId);

  res.status(200).json({
    success: true,
    message: "COURSE FETCHED SUCCESSFULLY",
    data: course,
  });
});

// APPLY FOR VERIFICATION
export const applyForVerification = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const { courseId } = req.params;

  const course = await getCourseByIdService(courseId, instructorId);

  if (!course.published) {
    return res.status(400).json({
      success: false,
      message: "Course must be published before applying for verification"
    });
  }

  if (course.verificationStatus === "inprocess") {
    return res.status(400).json({
      success: false,
      message: "Verification request already in process"
    });
  }

  if (course.verificationStatus === "verified") {
    return res.status(400).json({
      success: false,
      message: "Course is already verified"
    });
  }

  course.verificationStatus = "inprocess";
  course.rejectionReason = null;
  await course.save();

  res.status(200).json({
    success: true,
    message: "Verification request submitted successfully",
    data: course,
  });
});
