import { Course } from "../../models/Course.js";
import { Payment } from "../../models/Payment.js";

// convert paise to rupees
const toRupees = paise => Math.round(paise / 100);

export const getRevenueStatsService = async instructorId => {
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map(c => c._id);

  // total revenue (all PAID)
  const totalResult = await Payment.aggregate([
    { $match: { courseId: { $in: courseIds }, status: "PAID" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = totalResult[0]?.total || 0;

  // held funds
  const heldResult = await Payment.aggregate([
    {
      $match: {
        courseId: { $in: courseIds },
        status: "PAID",
        releaseStatus: "HELD",
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const heldFunds = heldResult[0]?.total || 0;

  // released funds
  const releasedResult = await Payment.aggregate([
    {
      $match: {
        courseId: { $in: courseIds },
        status: "PAID",
        releaseStatus: "RELEASED",
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const releasedFunds = releasedResult[0]?.total || 0;

  // refunded amount
  const refundedResult = await Payment.aggregate([
    { $match: { courseId: { $in: courseIds }, status: "REFUNDED" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const refundedAmount = refundedResult[0]?.total || 0;

  // total transactions count
  const totalTransactions = await Payment.countDocuments({
    courseId: { $in: courseIds },
    status: { $in: ["PAID", "REFUNDED"] },
  });

  return {
    totalRevenue: toRupees(totalRevenue),
    heldFunds: toRupees(heldFunds),
    releasedFunds: toRupees(releasedFunds),
    refundedAmount: toRupees(refundedAmount),
    totalTransactions,
  };
};

export const getMonthlyRevenueService = async (instructorId, year) => {
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map(c => c._id);

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59`);

  const monthlyData = await Payment.aggregate([
    {
      $match: {
        courseId: { $in: courseIds },
        status: "PAID",
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$amount" },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const months = [];
  for (let i = 1; i <= 12; i++) {
    const monthData = monthlyData.find(m => m._id === i);
    months.push({
      month: i,
      revenue: toRupees(monthData?.revenue || 0),
      transactions: monthData?.transactions || 0,
    });
  }

  return months;
};

export const getCourseRevenueService = async instructorId => {
  const courses = await Course.find({ instructor: instructorId }).select(
    "_id title thumbnail price"
  );
  const courseIds = courses.map(c => c._id);

  const revenueData = await Payment.aggregate([
    { $match: { courseId: { $in: courseIds }, status: "PAID" } },
    {
      $group: {
        _id: "$courseId",
        totalRevenue: { $sum: "$amount" },
        salesCount: { $sum: 1 },
        heldAmount: {
          $sum: { $cond: [{ $eq: ["$releaseStatus", "HELD"] }, "$amount", 0] },
        },
        releasedAmount: {
          $sum: {
            $cond: [{ $eq: ["$releaseStatus", "RELEASED"] }, "$amount", 0],
          },
        },
      },
    },
  ]);

  return courses
    .map(course => {
      const data = revenueData.find(
        r => r._id.toString() === course._id.toString()
      );
      return {
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        price: toRupees(course.price || 0),
        totalRevenue: toRupees(data?.totalRevenue || 0),
        salesCount: data?.salesCount || 0,
        heldAmount: toRupees(data?.heldAmount || 0),
        releasedAmount: toRupees(data?.releasedAmount || 0),
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
};
