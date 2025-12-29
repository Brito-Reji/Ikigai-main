// server/services/student/enrollmentService.js
import { Enrollment } from "../../models/Enrollment.js";
import { Lesson } from "../../models/Lesson.js";
import { Chapter } from "../../models/Chapter.js";
import mongoose from "mongoose";

export const getUserEnrollments = async userId => {
  const result = await Enrollment.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: "active",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "categories", 
        localField: "course.category",
        foreignField: "_id",
        as: "course.category",
      },
    },
    {
      $unwind: "$course.category", 
    },
    {
      $lookup: {
        from: "instructors",
        localField: "course.instructor",
        foreignField: "_id",
        as: "course.instructor",
      },
    },
    {
      $unwind: "$course.instructor",
    },
    {
      $project: {
        _id: 1,
        user: 1,
        payment: 1,
        status: 1,
        certificateIssued: 1,
        enrolledAt: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        progress: {
          completedLessons: "$progress.completedLessons",
          completionPercentage: "$progress.completionPercentage",
          lastAccessedLesson: "$progress.lastAccessedLesson",
          lastAccessedAt: "$progress.lastAccessedAt",
        },
        course: {
          _id: "$course._id",
          category: {
            _id: "$course.category._id",
            name: "$course.category.name",
            description: "$course.category.description",
            isBlocked: "$course.category.isBlocked",
          },
          title: "$course.title",
          thumbnail: "$course.thumbnail",
          price: "$course.price",
          instructor: {
            _id: "$course.instructor._id",
            firstName: "$course.instructor.firstName",
            lastName: "$course.instructor.lastName",
            profileImageUrl: "$course.instructor.profileImageUrl",
          },
        },
      },
    },
    {
      $sort: {
        enrolledAt: -1,
      },
    },
  ]);

  return result;
};

export const checkEnrollment = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
    status: "active",
  });
  return !!enrollment;
};

export const updateProgress = async (userId, courseId, lessonId) => {
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrollment) throw new Error("Not enrolled");

  if (!enrollment.progress.completedLessons.includes(lessonId)) {
    enrollment.progress.completedLessons.push(lessonId);
  }

  enrollment.progress.lastAccessedLesson = lessonId;
  enrollment.progress.lastAccessedAt = new Date();

  // Calculate completion percentage
  const totalLessons = await Lesson.countDocuments({
    chapter: { $in: await Chapter.find({ course: courseId }).distinct("_id") },
  });
  enrollment.progress.completionPercentage =
    (enrollment.progress.completedLessons.length / totalLessons) * 100;

  await enrollment.save();
  return enrollment;
};
