import asyncHandler from "express-async-handler";
import { submitReportService } from "../../services/student/reportService.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Submit course report
export const submitReport = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId, reason, otherReason } = req.body;

    if (!courseId || !reason) {
        throw new AppError("courseId and reason are required", HTTP_STATUS.BAD_REQUEST);
    }

    const report = await submitReportService(userId, courseId, reason, otherReason);

    res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Report submitted successfully",
        data: report,
    });
});
