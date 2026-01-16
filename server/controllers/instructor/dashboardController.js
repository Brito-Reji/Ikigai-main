import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import * as dashboardService from "../../services/instructor/dashboardService.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStatsService(req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Dashboard stats fetched successfully",
    data: stats,
  });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await dashboardService.getTransactionsService(
    req.user._id,
    page,
    limit
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Transactions fetched successfully",
    data: result,
  });
});
