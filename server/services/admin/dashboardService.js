import { Order } from "../../models/Order.js";
import { Course } from "../../models/Course.js";
import { User } from "../../models/User.js";
import { Instructor } from "../../models/Instructor.js";

// build date match for queries
const buildDateMatch = (startDate, endDate) => {
  if (!startDate && !endDate) return {};
  const match = {};
  if (startDate) match.$gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    match.$lte = end;
  }
  return Object.keys(match).length ? { createdAt: match } : {};
};

// get dashboard stats
export const getDashboardStats = async (startDate, endDate) => {
  const dateMatch = buildDateMatch(startDate, endDate);

  const revenueResult = await Order.aggregate([
    { $match: { status: "PAID", ...dateMatch } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const totalOrders = await Order.countDocuments({ status: "PAID", ...dateMatch });
  const totalRefunds = await Order.countDocuments({ status: "REFUNDED", ...dateMatch });

  // all-time totals — not date filtered
  const totalCourses = await Course.countDocuments();
  const totalStudents = await User.countDocuments();
  const totalInstructors = await Instructor.countDocuments();

  return {
    totalRevenue,
    totalCourses,
    totalStudents,
    totalInstructors,
    totalOrders,
    totalRefunds,
  };
};

// get recent orders
export const getRecentOrders = async (limit = 10, startDate, endDate) => {
  const dateMatch = buildDateMatch(startDate, endDate);

  const orders = await Order.find({
    status: { $in: ["PAID", "REFUNDED"] },
    ...dateMatch,
  })
    .populate("userId", "firstName lastName email")
    .populate("courseIds", "title price")
    .sort({ createdAt: -1 })
    .limit(limit);

  return orders;
};

// monthly revenue chart
export const getMonthlyRevenueData = async (startDate, endDate) => {
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), 0, 1);

  const rangeStart = startDate ? new Date(startDate) : defaultStart;
  const rangeEnd = endDate ? (() => { const d = new Date(endDate); d.setHours(23, 59, 59, 999); return d; })() : now;

  const monthlyData = await Order.aggregate([
    {
      $match: {
        status: "PAID",
        createdAt: { $gte: rangeStart, $lte: rangeEnd },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$amount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = months.map((month, index) => {
    const found = monthlyData.find(d => d._id.month === index + 1);
    return {
      month,
      revenue: found ? found.revenue / 100 : 0,
      orders: found ? found.orders : 0,
    };
  });

  return chartData;
};

// get all orders with pagination + date filter
export const getAllOrders = async ({ page = 1, limit = 20, status, startDate, endDate }) => {
  const query = {};
  if (status) query.status = status;

  const dateMatch = buildDateMatch(startDate, endDate);
  if (dateMatch.createdAt) query.createdAt = dateMatch.createdAt;

  const orders = await Order.find(query)
    .populate("userId", "firstName lastName email profileImageUrl")
    .populate("courseIds", "title price thumbnail")
    .populate("couponId", "code discountValue")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(query);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
