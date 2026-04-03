import { CourseReport } from "../../models/CourseReport.js";
import { Course } from "../../models/Course.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Submit or update a report
export const submitReportService = async (userId, courseId, reason, otherReason) => {
    const existing = await CourseReport.findOne({ courseId, reportedBy: userId });
    if (existing) {
        throw new AppError("You have already reported this course",HTTP_STATUS.BAD_REQUEST);
    }

    const course = await Course.findById(courseId);
    
    if (!course || course.deleted) {
        throw new AppError("Course not found",HTTP_STATUS.NOT_FOUND);
    }

    const report = await CourseReport.create({
        courseId,
        reportedBy: userId,
        reason,
        otherReason: reason === "other" ? otherReason : undefined,
    });

    return report;
};
