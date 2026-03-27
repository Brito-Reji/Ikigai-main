import asyncHandler from "express-async-handler";
import {
    getAllReportsService,
    getReportDetailsService,
    updateReportStatusService,
} from "../../services/admin/reportService.js";

// Get all reports
export const getAllReports = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await getAllReportsService({ page, limit, status });

    res.status(200).json({
        success: true,
        message: "Reports fetched",
        data: result.reports,
        pagination: result.pagination,
    });
});

// Get report details
export const getReportDetails = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const report = await getReportDetailsService(reportId);

    res.status(200).json({
        success: true,
        message: "Report details fetched",
        data: report,
    });
});

// Update report status
export const updateReportStatus = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { status, adminNote, blockCourse } = req.body;

    if (!status) {
        res.status(400);
        throw new Error("Status is required");
    }

    const report = await updateReportStatusService(reportId, status, adminNote, blockCourse);

    res.status(200).json({
        success: true,
        message: "Report updated",
        data: report,
    });
});
