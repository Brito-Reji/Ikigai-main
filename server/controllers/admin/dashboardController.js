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
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders(10);
  const chartData = await getMonthlyRevenueData();

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
  const { page = 1, limit = 20, status } = req.query;

  const result = await getAllOrders({
    page: parseInt(page),
    limit: parseInt(limit),
    status,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.orders,
    pagination: result.pagination,
  });
});
