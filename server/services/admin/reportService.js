import { CourseReport } from "../../models/CourseReport.js";
import { toggleCourseBlockService } from "./courseService.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Get all reports paginated
export const getAllReportsService = async ({ page = 1, limit = 20, status }) => {
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await CourseReport.find(query)
        .populate("courseId", "title thumbnail instructor")
        .populate("reportedBy", "firstName lastName email avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await CourseReport.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    return {
        reports,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            total,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1,
        },
    };
};

// Get single report details
export const getReportDetailsService = async (reportId) => {
    const report = await CourseReport.findById(reportId)
        .populate("courseId", "title thumbnail instructor blocked blockReason")
        .populate("reportedBy", "firstName lastName email avatar");

    if (!report) {
        throw new AppError("Report not found", HTTP_STATUS.NOT_FOUND);

    }

    return report;
};

// Update report status
export const updateReportStatusService = async (reportId, status, adminNote, blockCourse) => {
    const report = await CourseReport.findById(reportId).populate("courseId");

    if (!report) {
        throw new AppError("Report not found", HTTP_STATUS.NOT_FOUND);
    }

    report.status = status;
    if (adminNote) report.adminNote = adminNote;
    await report.save();

    // if admin wants to block the course from this report action
    if (blockCourse && status === "actioned" && report.courseId) {
        const reason = adminNote || "Policy violation reported by a user";
        await toggleCourseBlockService(report.courseId._id.toString(), reason);
    }

    return report;
};
