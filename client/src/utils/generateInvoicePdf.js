import jsPDF from "jspdf";
import "jspdf-autotable";
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

// brand colors
const INDIGO = [79, 70, 229];
const PURPLE = [124, 58, 237];
const DARK = [17, 24, 39];
const GRAY = [107, 114, 128];
const LIGHT_BG = [243, 244, 246];

// generate purchase invoice pdf
const generateInvoicePdf = ({
  paymentId,
  courses = [],
  date,
  orderAmount,
  discountAmount,
  couponCode,
  paymentMethod,
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 0;

  // header band
  doc.setFillColor(...INDIGO);
  doc.rect(0, 0, pageWidth, 45, "F");

  // gradient accent
  doc.setFillColor(...PURPLE);
  doc.rect(0, 38, pageWidth, 7, "F");

  // brand name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("IKIGAI", 20, 22);

  // subtitle
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 255);
  doc.text("Learn. Grow. Transform.", 20, 32);

  // invoice label
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", pageWidth - 20, 22, { align: "right" });

  y = 60;

  // invoice details
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("Invoice No", 20, y);
  doc.text("Date", pageWidth / 2 + 10, y);

  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.text(`INV-${paymentId?.slice(-10) || Date.now()}`, 20, y + 7);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(date || new Date()), pageWidth / 2 + 10, y + 7);

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("Payment ID", 20, y);
  doc.text("Payment Method", pageWidth / 2 + 10, y);

  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(paymentId || "N/A", 20, y + 7);
  doc.text(
    capitalizeFirst(paymentMethod || "razorpay"),
    pageWidth / 2 + 10,
    y + 7
  );

  y += 18;

  // divider
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  // courses table
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INDIGO);
  doc.text("Course Details", 20, y);
  y += 6;

  const tableBody = courses.map((course, i) => [
    `${i + 1}`,
    course.title || "Untitled Course",
    `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`.trim() ||
      "-",
    `₹${formatPrice(course.price)}`,
  ]);

  doc.autoTable({
    startY: y,
    head: [["#", "Course", "Instructor", "Price"]],
    body: tableBody,
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: INDIGO,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: DARK,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 45 },
      3: { cellWidth: 30, halign: "right" },
    },
    styles: {
      cellPadding: 4,
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // payment summary
  const subtotal = courses.reduce(
    (sum, c) => sum + (parseFloat(c.price) || 0),
    0
  );
  const discount = parseFloat(discountAmount) || 0;
  const total =
    orderAmount != null ? parseFloat(orderAmount) : subtotal - discount;

  // summary box
  const boxX = pageWidth - 90;
  const boxW = 70;

  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(boxX, y, boxW, discount > 0 ? 52 : 40, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("Subtotal:", boxX + 5, y + 10);
  doc.setTextColor(...DARK);
  doc.text(`₹${formatPrice(subtotal)}`, boxX + boxW - 5, y + 10, {
    align: "right",
  });

  let summaryY = y + 10;

  if (discount > 0) {
    summaryY += 12;
    doc.setTextColor(22, 163, 74);
    doc.text(
      `Discount${couponCode ? ` (${couponCode})` : ""}:`,
      boxX + 5,
      summaryY
    );
    doc.text(`-₹${formatPrice(discount)}`, boxX + boxW - 5, summaryY, {
      align: "right",
    });
  }

  summaryY += 14;
  doc.setDrawColor(199, 210, 254);
  doc.line(boxX + 5, summaryY - 5, boxX + boxW - 5, summaryY - 5);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INDIGO);
  doc.text("Total Paid:", boxX + 5, summaryY + 2);
  doc.text(`₹${formatPrice(total)}`, boxX + boxW - 5, summaryY + 2, {
    align: "right",
  });

  // footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INDIGO);
  doc.text("Thank you for your purchase!", pageWidth / 2, footerY + 10, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(
    "Visit ikigai.com to access your courses anytime.",
    pageWidth / 2,
    footerY + 18,
    { align: "center" }
  );

  // save
  const filename = `Ikigai-Invoice-${paymentId?.slice(-10) || Date.now()}.pdf`;
  doc.save(filename);
};

// helpers
const formatDate = date =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatPrice = val => {
  const num = parseFloat(val) || 0;
  return num.toFixed(2);
};

const capitalizeFirst = str =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export default generateInvoicePdf;
