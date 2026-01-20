import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import * as revenueService from "../../services/instructor/revenueService.js";

export const getRevenueStats = asyncHandler(async (req, res) => {
  const stats = await revenueService.getRevenueStatsService(req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Revenue stats fetched successfully",
    data: stats,
  });
});

export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const monthly = await revenueService.getMonthlyRevenueService(
    req.user._id,
    year
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Monthly revenue fetched successfully",
    data: monthly,
  });
});

export const getCourseRevenue = asyncHandler(async (req, res) => {
  const courses = await revenueService.getCourseRevenueService(req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Course revenue fetched successfully",
    data: courses,
  });
});
