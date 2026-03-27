import { CourseReport } from "../../models/CourseReport.js";
import { Course } from "../../models/Course.js";

// Submit or update a report
export const submitReportService = async (userId, courseId, reason, otherReason) => {
    const existing = await CourseReport.findOne({ courseId, reportedBy: userId });
    if (existing) {
        const error = new Error("You have already reported this course");
        error.statusCode = 409;
        throw error;
    }

    const course = await Course.findById(courseId);
    
    if (!course || course.deleted) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    const report = await CourseReport.create({
        courseId,
        reportedBy: userId,
        reason,
        otherReason: reason === "other" ? otherReason : undefined,
    });

    return report;
};
