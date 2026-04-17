import React, { useState } from "react";
import { useAdminOrders, useAdminDashboard } from "@/hooks/useAdmin";
import { ShoppingCart, Search, ChevronLeft, ChevronRight, Download, X, Filter, Calendar, User, CreditCard, Tag, Wallet, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import generateSalesReportPdf from "@/utils/generateSalesReportPdf";
import generateSalesReportExcel from "@/utils/generateSalesReportExcel";

// preset time ranges
const RANGES = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "This Month", value: "thismonth" },
  { label: "All Time", value: "all" },
  { label: "Custom", value: "custom" },
];

const getDateRange = (range) => {
  const now = new Date();
  const start = new Date();

  if (range === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "7days") {
    start.setDate(now.getDate() - 7);
  } else if (range === "30days") {
    start.setDate(now.getDate() - 30);
  } else if (range === "thismonth") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    return null;
  }

  return { from: start, to: now };
};

// order detail panel
function OrderDetailPanel({ order, onClose, formatDate }) {
  if (!order) return null;

  const totalCharged = (order.amount || 0);
  const original = (order.originalAmount || order.amount || 0);
  const discount = (order.discountAmount || 0);
  const wallet = (order.walletAmountUsed || 0);

  const statusColor = order.status === "PAID"
    ? "bg-green-100 text-green-800"
    : order.status === "REFUNDED"
    ? "bg-red-100 text-red-800"
    : "bg-yellow-100 text-yellow-800";

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      {/* panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-indigo-50">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order Details</p>
            <p className="font-mono text-sm text-gray-800 font-semibold mt-0.5">#{order.razorpayOrderId?.slice(-14)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
              {order.status}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* customer */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Customer
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                {order.userId?.firstName?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{order.userId?.firstName} {order.userId?.lastName}</p>
                <p className="text-xs text-gray-500">{order.userId?.email}</p>
              </div>
            </div>
          </div>

          {/* courses */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Courses ({order.courseIds?.length || 0})
            </p>
            <div className="space-y-2">
              {order.courseIds?.map((course) => (
                <div key={course._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-12 h-8 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-500">₹{course.price/100}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* payment breakdown */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Payment
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentMethod === "wallet" ? "bg-purple-100 text-purple-700"
                  : order.paymentMethod === "mixed" ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
                }`}>{order.paymentMethod || "razorpay"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Original amount</span>
                <span className="font-medium text-gray-900">₹{original/100}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Coupon {order.couponCode && `(${order.couponCode})`}
                  </span>
                  <span className="text-green-600 font-medium">-₹{discount}</span>
                </div>
              )}
              {wallet > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> Wallet used
                  </span>
                  <span className="text-purple-600 font-medium">-₹{wallet}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                <span className="text-gray-700">Total charged</span>
                <span className="text-gray-900">₹{totalCharged/100}</span>
              </div>
            </div>
          </div>

          {/* timestamps */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Timeline
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Placed on</span>
                <span className="text-gray-800">{formatDate(order.createdAt)}</span>
              </div>
              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last updated</span>
                  <span className="text-gray-800">{formatDate(order.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const AdminOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // report modal state
  const [showModal, setShowModal] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [reportRange, setReportRange] = useState("all");
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

  const { data, isLoading, error } = useAdminOrders({ page, limit: 20, status: status || undefined });
  const { data: dashboardData } = useAdminDashboard();

  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = data?.orders?.filter((order) => {
    if (!search) return true;
    const customerName = `${order.userId?.firstName} ${order.userId?.lastName}`.toLowerCase();
    const email = order.userId?.email?.toLowerCase() || "";
    const orderId = order.razorpayOrderId?.toLowerCase() || "";
    return (
      customerName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      orderId.includes(search.toLowerCase())
    );
  });

  // filter orders by selected status + date range
  const getFilteredOrders = () => {
    let orders = data?.orders || [];

    if (reportStatus) {
      orders = orders.filter((o) => o.status === reportStatus);
    }

    if (reportRange !== "all" && reportRange !== "custom") {
      const range = getDateRange(reportRange);
      if (range) {
        orders = orders.filter((o) => {
          const d = new Date(o.createdAt);
          return d >= range.from && d <= range.to;
        });
      }
    } else if (reportRange === "custom") {
      const from = reportStartDate ? new Date(reportStartDate) : null;
      const to = reportEndDate ? new Date(reportEndDate + "T23:59:59") : null;
      orders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    }

    return orders;
  };

  const handleDownload = (format) => {
    const orders = getFilteredOrders();

    if (orders.length === 0) {
      toast.error("No orders match the selected filters");
      return;
    }

    const dateLabel = reportRange === "custom"
      ? `${reportStartDate || "?"} → ${reportEndDate || "now"}`
      : RANGES.find((r) => r.value === reportRange)?.label || "All Time";

    if (format === "excel") {
      generateSalesReportExcel({
        stats: dashboardData?.stats || {},
        orders,
        dateLabel,
      });
      toast.success(`Excel downloaded (${orders.length} orders)`);
    } else {
      generateSalesReportPdf({
        mode: "admin",
        stats: dashboardData?.stats || {},
        orders,
        dateLabel,
      });
      toast.success(`PDF downloaded (${orders.length} orders)`);
    }

    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load orders</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-indigo-600" />
          Orders
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {data?.pagination?.total || 0} orders
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or order ID..."
            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="REFUNDED">Refunded</option>
          <option value="CREATED">Pending</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders?.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        #{order.razorpayOrderId?.slice(-10)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {order.userId?.firstName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{order.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.courseIds?.length} course(s)</div>
                      <div className="text-xs text-gray-500 max-w-[200px] truncate">
                        {order.courseIds?.map(c => c.title).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.paymentMethod === "wallet"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.paymentMethod || "razorpay"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.status === "REFUNDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{formatAmount(order.originalAmount || order.amount)}
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="text-xs text-green-600">
                          -₹{formatAmount(order.discountAmount)} discount
                        </div>
                      )}
                      {order.walletAmountUsed > 0 && (
                        <div className="text-xs text-purple-600">
                          -₹{formatAmount(order.walletAmountUsed)} wallet
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {data.pagination.page} of {data.pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/20 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-indigo-50">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-gray-800">Report Filters</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "" },
                    { label: "Paid", value: "PAID" },
                    { label: "Refunded", value: "REFUNDED" },
                    { label: "Pending", value: "CREATED" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setReportStatus(opt.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        reportStatus === opt.value
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* time range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <div className="flex flex-wrap gap-2">
                  {RANGES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setReportRange(r.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        reportRange === r.value
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* custom date range */}
              {reportRange === "custom" && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* summary hint */}
              <p className="text-xs text-gray-400">
                Filters apply to the currently loaded orders on this page.
              </p>
            </div>

            {/* modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload("excel")}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => handleDownload("pdf")}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
