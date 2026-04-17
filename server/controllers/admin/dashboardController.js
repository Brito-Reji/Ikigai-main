import asyncHandler from "express-async-handler";
import {
  getDashboardStats,
  getRecentOrders,
  getMonthlyRevenueData,
  getAllOrders,
} from "../../services/admin/dashboardService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// get dashboard stats
export const getDashboard = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const stats = await getDashboardStats(startDate, endDate);
  const recentOrders = await getRecentOrders(10, startDate, endDate);
  const chartData = await getMonthlyRevenueData(startDate, endDate);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      stats,
      recentOrders,
      chartData,
    },
  });
});

// get all orders
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, startDate, endDate } = req.query;

  const result = await getAllOrders({
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    startDate,
    endDate,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.orders,
    pagination: result.pagination,
  });
});
