import * as XLSX from "xlsx";

const fmtAmount = (val) => parseFloat(((val || 0) / 100).toFixed(2));

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// summary sheet rows from stats
const buildSummarySheet = (stats, dateLabel) => {
  const rows = [
    ["IKIGAI — Sales Report"],
    ["Generated on", fmtDate(new Date())],
    ["Period", dateLabel || "All Time"],
    [],
    ["Metric", "Value"],
    ["Total Revenue (₹)", fmtAmount(stats.totalRevenue)],
    ["Total Orders", stats.totalOrders || 0],
    ["Total Refunds", stats.totalRefunds || 0],
    ["Total Students", stats.totalStudents || 0],
    ["Total Instructors", stats.totalInstructors || 0],
    ["Total Courses", stats.totalCourses || 0],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // column widths
  ws["!cols"] = [{ wch: 24 }, { wch: 18 }];

  return ws;
};

// orders sheet
const buildOrdersSheet = (orders) => {
  const header = [
    "Order ID",
    "Customer",
    "Email",
    "Courses",
    "Original Amount (₹)",
    "Discount (₹)",
    "Wallet Used (₹)",
    "Total Charged (₹)",
    "Payment Method",
    "Status",
    "Date",
  ];

  const rows = orders.map((o) => [
    `#${o.razorpayOrderId?.slice(-10) || "N/A"}`,
    `${o.userId?.firstName || ""} ${o.userId?.lastName || ""}`.trim() || "-",
    o.userId?.email || "-",
    o.courseIds?.map((c) => c.title).join(", ") || "-",
    fmtAmount(o.originalAmount || o.amount),
    fmtAmount(o.discountAmount),
    fmtAmount(o.walletAmountUsed),
    fmtAmount(o.amount),
    o.paymentMethod || "razorpay",
    o.status,
    fmtDate(o.createdAt),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);

  ws["!cols"] = [
    { wch: 16 }, { wch: 22 }, { wch: 28 }, { wch: 36 },
    { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 16 },
    { wch: 16 }, { wch: 12 }, { wch: 14 },
  ];

  return ws;
};

// monthly breakdown sheet
const buildMonthlySheet = (monthlyData) => {
  const header = ["Month", "Revenue (₹)", "Orders"];
  const rows = (monthlyData || []).map((m) => [m.month, m.revenue, m.orders]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws["!cols"] = [{ wch: 12 }, { wch: 16 }, { wch: 10 }];
  return ws;
};

// main export fn
const generateSalesReportExcel = ({ stats = {}, orders = [], monthlyData = [], dateLabel }) => {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildSummarySheet(stats, dateLabel), "Summary");
  XLSX.utils.book_append_sheet(wb, buildOrdersSheet(orders), "Orders");

  if (monthlyData.length > 0) {
    XLSX.utils.book_append_sheet(wb, buildMonthlySheet(monthlyData), "Monthly Breakdown");
  }

  const filename = `Ikigai-Report-${Date.now()}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export default generateSalesReportExcel;
