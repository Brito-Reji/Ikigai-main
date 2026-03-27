import asyncHandler from "express-async-handler";
import { submitReportService } from "../../services/student/reportService.js";

// Submit course report
export const submitReport = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId, reason, otherReason } = req.body;

    if (!courseId || !reason) {
        res.status(400);
        throw new Error("courseId and reason are required");
    }

    const report = await submitReportService(userId, courseId, reason, otherReason);

    res.status(201).json({
        success: true,
        message: "Report submitted successfully",
        data: report,
    });
});
