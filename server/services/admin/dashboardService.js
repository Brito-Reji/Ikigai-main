import { Order } from "../../models/Order.js";
import { Course } from "../../models/Course.js";
import { User } from "../../models/User.js";

// get dashboard stats
export const getDashboardStats = async () => {
  // total revenue from paid orders
  const revenueResult = await Order.aggregate([
    { $match: { status: "PAID" } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  // total courses
  const totalCourses = await Course.countDocuments();

  // total students
  const totalStudents = await User.countDocuments({ role: "student" });

  // total instructors
  const totalInstructors = await User.countDocuments({ role: "instructor" });

  // total orders
  const totalOrders = await Order.countDocuments({ status: "PAID" });

  // refunds count
  const totalRefunds = await Order.countDocuments({ status: "REFUNDED" });

  return {
    totalRevenue,
    totalCourses,
    totalStudents,
    totalInstructors,
    totalOrders,
    totalRefunds,
  };
};

// get recent orders for dashboard
export const getRecentOrders = async (limit = 10) => {
  const orders = await Order.find({ status: { $in: ["PAID", "REFUNDED"] } })
    .populate("userId", "firstName lastName email")
    .populate("courseIds", "title price")
    .sort({ createdAt: -1 })
    .limit(limit);

  return orders;
};

// get monthly revenue data for chart
export const getMonthlyRevenueData = async () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const monthlyData = await Order.aggregate([
    {
      $match: {
        status: "PAID",
        createdAt: { $gte: startOfYear },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$amount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // fill all months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const chartData = months.map((month, index) => {
    const found = monthlyData.find(d => d._id === index + 1);
    return {
      month,
      revenue: found ? found.revenue / 100 : 0,
      orders: found ? found.orders : 0,
    };
  });

  return chartData;
};

// get all orders with pagination
export const getAllOrders = async ({ page = 1, limit = 20, status }) => {
  const query = {};
  if (status) {
    query.status = status;
  }

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
