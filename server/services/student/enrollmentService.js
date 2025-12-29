// server/services/student/enrollmentService.js
import { Enrollment } from "../../models/Enrollment.js";
import { Lesson } from "../../models/Lesson.js";
import { Chapter } from "../../models/Chapter.js";
export const getUserEnrollments = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId, status: "active" })
    .populate({
      path: "course",
      select: "title thumbnail instructor category price description",
      populate: {
        path: "instructor",
        select: "firstName lastName avatar"
      }
    })
    .sort({ enrolledAt: -1 });

  // Manually fetch chapters for each course
  for (const enrollment of enrollments) {
    if (enrollment.course) {
      const chapters = await Chapter.find({ course: enrollment.course._id })
        .select("title description order")
        .sort({ order: 1 })
        .lean();

      // Fetch lessons for each chapter
      for (const chapter of chapters) {
        const lessons = await Lesson.find({ chapter: chapter._id })
          .select("title description duration videoUrl order resources")
          .sort({ order: 1 })
          .lean();
        chapter.lessons = lessons;
      }

      enrollment.course.chapters = chapters;
    }
  }

  return enrollments;
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
