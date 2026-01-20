import { Course } from "../../models/Course.js";
import { Payment } from "../../models/Payment.js";
import { Enrollment } from "../../models/Enrollment.js";

// convert paise to rupees
const toRupees = paise => Math.round(paise / 100);

export const getDashboardStatsService = async instructorId => {
  // get instructor courses
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map(c => c._id);

  // total students
  const totalStudents = await Enrollment.countDocuments({
    course: { $in: courseIds },
    status: { $in: ["active", "completed"] },
  });

  // total revenue from paid payments
  const revenueResult = await Payment.aggregate([
    { $match: { courseId: { $in: courseIds }, status: "PAID" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // held funds (escrow - not yet released)
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

  // released funds (available to withdraw)
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

  return {
    totalCourses: courses.length,
    totalStudents,
    totalRevenue: toRupees(totalRevenue),
    heldFunds: toRupees(heldFunds),
    releasedFunds: toRupees(releasedFunds),
  };
};

export const getTransactionsService = async (
  instructorId,
  page = 1,
  limit = 10
) => {
  // get instructor courses
  const courses = await Course.find({ instructor: instructorId }).select("_id");
  const courseIds = courses.map(c => c._id);

  const skip = (page - 1) * limit;

  const transactions = await Payment.find({
    courseId: { $in: courseIds },
    status: { $in: ["PAID", "REFUNDED"] },
  })
    .populate("userId", "firstName lastName email")
    .populate("courseId", "title price thumbnail")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments({
    courseId: { $in: courseIds },
    status: { $in: ["PAID", "REFUNDED"] },
  });

  return {
    transactions: transactions.map(t => ({
      _id: t._id,
      student: {
        name:
          `${t.userId?.firstName || ""} ${t.userId?.lastName || ""}`.trim() ||
          "Unknown",
        email: t.userId?.email || "N/A",
      },
      course: {
        title: t.courseId?.title || "Unknown Course",
        thumbnail: t.courseId?.thumbnail,
      },
      amount: t.amount / 100,
      status: t.status,
      releaseStatus: t.releaseStatus,
      releaseDate: t.releaseDate,
      paymentId: t.razorpayPaymentId,
      date: t.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
