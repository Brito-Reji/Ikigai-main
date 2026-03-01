import jsPDF from "jspdf";
import "jspdf-autotable";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

// brand colors
const INDIGO = [79, 70, 229];
const PURPLE = [124, 58, 237];
const DARK = [17, 24, 39];
const GRAY = [107, 114, 128];
const GREEN = [22, 163, 74];
const RED = [220, 38, 38];
const YELLOW = [202, 138, 4];
const LIGHT_BG = [243, 244, 246];

// generate sales report pdf for admin or instructor
const generateSalesReportPdf = ({
  mode = "admin",
  stats = {},
  courses = [],
  orders = [],
  monthlyData = [],
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 0;

  // header band
  doc.setFillColor(...INDIGO);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setFillColor(...PURPLE);
  doc.rect(0, 38, pageWidth, 7, "F");

  // brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("IKIGAI", 20, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 255);
  doc.text("Learn. Grow. Transform.", 20, 32);

  // report title
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("SALES REPORT", pageWidth - 20, 20, { align: "right" });

  doc.setFontSize(9);
  doc.setTextColor(200, 200, 255);
  const reportType =
    mode === "admin" ? "Platform Overview" : "Instructor Report";
  doc.text(reportType, pageWidth - 20, 30, { align: "right" });

  y = 58;

  // report date
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(`Generated on: ${formatDate(new Date())}`, 20, y);
  y += 12;

  // stats cards
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INDIGO);
  doc.text("Overview", 20, y);
  y += 8;

  const statCards =
    mode === "admin" ? getAdminStats(stats) : getInstructorStats(stats);

  const cardWidth = (pageWidth - 50) / 3;
  const cardHeight = 28;

  statCards.forEach((card, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const cx = 20 + col * (cardWidth + 5);
    const cy = y + row * (cardHeight + 5);

    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(cx, cy, cardWidth, cardHeight, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(card.label, cx + 5, cy + 10);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...(card.color || DARK));
    doc.text(card.value, cx + 5, cy + 22);
  });

  const totalRows = Math.ceil(statCards.length / 3);
  y += totalRows * (cardHeight + 5) + 10;

  // monthly summary
  if (monthlyData.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INDIGO);
    doc.text("Monthly Breakdown", 20, y);
    y += 6;

    const monthNames = [
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
    const monthlyBody = monthlyData.map((m, i) => [
      monthNames[m.month ? m.month - 1 : i] || monthNames[i],
      `₹${formatCurrency(m.revenue)}`,
      `${m.transactions || m.orders || 0}`,
    ]);

    doc.autoTable({
      startY: y,
      head: [["Month", "Revenue", "Transactions"]],
      body: monthlyBody,
      margin: { left: 20, right: 20 },
      headStyles: {
        fillColor: INDIGO,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: DARK },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50, halign: "right" },
        2: { cellWidth: 40, halign: "right" },
      },
      styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.3 },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // course revenue table (instructor) or orders table (admin)
  if (mode === "instructor" && courses.length > 0) {
    checkPageBreak(doc, y, 40);
    y = doc.lastAutoTable?.finalY ? y : y;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INDIGO);
    doc.text("Revenue by Course", 20, y);
    y += 6;

    const courseBody = courses.map(c => [
      c.title || "Untitled",
      `${c.salesCount || 0}`,
      `₹${formatCurrency(c.totalRevenue)}`,
      `₹${formatCurrency(c.heldAmount)}`,
      `₹${formatCurrency(c.releasedAmount)}`,
    ]);

    doc.autoTable({
      startY: y,
      head: [["Course", "Sales", "Revenue", "Held", "Released"]],
      body: courseBody,
      margin: { left: 20, right: 20 },
      headStyles: {
        fillColor: INDIGO,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8, textColor: DARK },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 28, halign: "right" },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 28, halign: "right" },
      },
      styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.3 },
    });
  }

  if (mode === "admin" && orders.length > 0) {
    checkPageBreak(doc, y, 40);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INDIGO);
    doc.text("Recent Orders", 20, y);
    y += 6;

    const orderBody = orders
      .slice(0, 30)
      .map(o => [
        `#${o.razorpayOrderId?.slice(-8) || "N/A"}`,
        `${o.userId?.firstName || ""} ${o.userId?.lastName || ""}`.trim() ||
          "-",
        `${o.courseIds?.length || 0}`,
        `₹${formatCurrency((o.originalAmount || o.amount) / 100)}`,
        o.status,
        formatShortDate(o.createdAt),
      ]);

    doc.autoTable({
      startY: y,
      head: [["Order ID", "Customer", "Courses", "Amount", "Status", "Date"]],
      body: orderBody,
      margin: { left: 20, right: 20 },
      headStyles: {
        fillColor: INDIGO,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8, textColor: DARK },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.3 },
      didParseCell: data => {
        if (data.column.index === 4 && data.section === "body") {
          const val = data.cell.raw;
          if (val === "PAID") data.cell.styles.textColor = GREEN;
          else if (val === "REFUNDED") data.cell.styles.textColor = RED;
          else data.cell.styles.textColor = YELLOW;
        }
      },
    });
  }

  // footer
  const footerY = doc.internal.pageSize.getHeight() - 25;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INDIGO);
  doc.text("IKIGAI", 20, footerY + 10);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.setFontSize(8);
  doc.text("This is a system-generated report.", pageWidth - 20, footerY + 10, {
    align: "right",
  });

  // save
  const filename = `Ikigai-Sales-Report-${mode}-${Date.now()}.pdf`;
  doc.save(filename);
};

// admin stats cards
const getAdminStats = s => [
  {
    label: "Total Revenue",
    value: `₹${formatCurrency((s.totalRevenue || 0) / 100)}`,
    color: GREEN,
  },
  { label: "Total Orders", value: `${s.totalOrders || 0}`, color: INDIGO },
  { label: "Total Students", value: `${s.totalStudents || 0}`, color: PURPLE },
  { label: "Total Courses", value: `${s.totalCourses || 0}`, color: DARK },
  {
    label: "Total Instructors",
    value: `${s.totalInstructors || 0}`,
    color: DARK,
  },
  { label: "Refunds", value: `${s.totalRefunds || 0}`, color: RED },
];

// instructor stats cards
const getInstructorStats = s => [
  {
    label: "Total Revenue",
    value: `₹${formatCurrency(s.totalRevenue || 0)}`,
    color: GREEN,
  },
  {
    label: "Held Funds",
    value: `₹${formatCurrency(s.heldFunds || 0)}`,
    color: YELLOW,
  },
  {
    label: "Released Funds",
    value: `₹${formatCurrency(s.releasedFunds || 0)}`,
    color: GREEN,
  },
  {
    label: "Refunded",
    value: `₹${formatCurrency(s.refundedAmount || 0)}`,
    color: RED,
  },
  {
    label: "Total Transactions",
    value: `${s.totalTransactions || 0}`,
    color: INDIGO,
  },
];

// helpers
const formatDate = d =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatShortDate = d =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatCurrency = val => {
  const num = parseFloat(val) || 0;
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const checkPageBreak = (doc, y, needed) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 30) {
    doc.addPage();
  }
};

export default generateSalesReportPdf;
