import asyncHandler from "express-async-handler";
import {
  getAllCourseByInstructorService,
  createCourseService,
  updateCourseService,
  getCourseByIdService,
} from "../../services/instructor/courseService.js";
import { Course } from "../../models/Course.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// GET ALL COURSES OF INSTRUCTOR
export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const courses = await getAllCourseByInstructorService(instructorId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "COURSES FETCHED SUCCESSFULLY",
    data: courses,
  });
});

// CREATE NEW COURSE
export const createCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const course = await createCourseService(instructorId, req.body);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "COURSE CREATED SUCCESSFULLY",
    data: course,
  });
});

// UPDATE EXISTING COURSE
export const updateCourse = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const { courseId } = req.params;

  const updatedCourse = await updateCourseService(
    courseId,
    instructorId,
    req.body
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "COURSE UPDATED SUCCESSFULLY",
    data: updatedCourse,
  });
});

// GET COURSE BY ID
export const getCourseById = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const { courseId } = req.params;

  const course = await getCourseByIdService(courseId, instructorId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "COURSE FETCHED SUCCESSFULLY",
    data: course,
  });
});

// APPLY FOR VERIFICATION
export const applyForVerification = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const { courseId } = req.params;

  const course = await Course.findById(courseId)

  if (!course) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "Course not found",
    });
  }

  


  if (course.instructor.toString() !== instructorId.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: "You can only apply for verification on your own courses",
    });
  }

  // Course should be in draft (not published yet)
  if (course.published) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Cannot apply for verification on already published course",
    });
  }

  if (course.verificationStatus === "inprocess") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Verification request already in process",
    });
  }

  if (course.verificationStatus === "verified") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Course is already verified. You can now publish it.",
    });
  }

  course.verificationStatus = "inprocess";
  course.rejectionReason = null;
  await course.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Verification request submitted successfully",
    data: course,
  });
});

// TOGGLE PUBLISH STATUS
export const togglePublish = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "Course not found",
    });
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: "You can only publish your own courses",
    });
  }

  // Can only publish if course is verified
  if (!course.published && course.verificationStatus !== "verified") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message:
        "Course must be verified before publishing. Please apply for verification first.",
    });
  }

  course.published = !course.published;
  await course.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: course.published
      ? "Course published successfully"
      : "Course unpublished",
    data: course,
  });
});
