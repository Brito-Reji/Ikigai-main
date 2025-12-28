// server/services/student/enrollmentService.js
import { Enrollment } from "../../models/Enrollment.js";
import { Lesson } from "../../models/Lesson.js";
import { Chapter } from "../../models/Chapter.js";
export const getUserEnrollments = async (userId) => {
  return await Enrollment.find({ user: userId, status: "active" })
    .populate({
      path: "course",
      select: "title thumbnail instructor category price",
      populate: {
        path: "instructor",
        select: "firstName lastName"
      }
    })
    .sort({ enrolledAt: -1 });
};

export const checkEnrollment = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
    status: "active",
  })
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
    chapter: { $in: await Chapter.find({ course: courseId }).distinct("_id") }
  });
  enrollment.progress.completionPercentage = 
    (enrollment.progress.completedLessons.length / totalLessons) * 100;

  await enrollment.save();
  return enrollment;
};
