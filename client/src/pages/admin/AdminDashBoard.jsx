import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAdminDashboard } from "@/hooks/useAdmin";
import {
  Users, BookOpen, TrendingUp, ShoppingCart,
  RefreshCcw, GraduationCap, Download, Calendar, X, Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import generateSalesReportPdf from "@/utils/generateSalesReportPdf";
import generateSalesReportExcel from "@/utils/generateSalesReportExcel";

// preset ranges
const RANGES = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
  { label: "This Month", value: "thismonth" },
  { label: "All Time", value: "all" },
  { label: "Custom", value: "custom" },
];

// stable params — no live Date() calls inside, presets omit endDate (server defaults to now)
const buildDateParams = (range, customFrom, customTo) => {
  if (range === "today") {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    return { startDate: start.toISOString() };
  }
  if (range === "7days") {
    const start = new Date(); start.setDate(start.getDate() - 7);
    return { startDate: start.toISOString() };
  }
  if (range === "30days") {
    const start = new Date(); start.setDate(start.getDate() - 30);
    return { startDate: start.toISOString() };
  }
  if (range === "thismonth") {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: start.toISOString() };
  }
  if (range === "custom" && customFrom) {
    const params = { startDate: new Date(customFrom).toISOString() };
    if (customTo) params.endDate = new Date(customTo + "T23:59:59").toISOString();
    return params;
  }
  return {};
};

const getDateLabel = (range, from, to) => {
  if (range === "all") return "All Time";
  if (range === "today") return "Today";
  if (range === "7days") return "Last 7 Days";
  if (range === "30days") return "Last 30 Days";
  if (range === "thismonth") return "This Month";
  if (range === "custom") return `${from || "?"} → ${to || "now"}`;
  return "";
};

const AdminDashboard = () => {
  const [activeRange, setActiveRange] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // memoized so queryKey stays stable between renders
  const dateParams = useMemo(
    () => buildDateParams(activeRange, customFrom, customTo),
    [activeRange, customFrom, customTo]
  );

  const { data, isLoading, error } = useAdminDashboard(dateParams);

  const { stats, recentOrders, chartData } = data || {};

  const formatAmount = (amount) => (amount / 100).toFixed(2);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // download modal state
  const [showModal, setShowModal] = useState(false);
  const [modalRange, setModalRange] = useState("all");
  const [modalFrom, setModalFrom] = useState("");
  const [modalTo, setModalTo] = useState("");
  const [modalStatus, setModalStatus] = useState("");

  // open modal — pre-fill with current dashboard filter
  const openModal = () => {
    setModalRange(activeRange);
    setModalFrom(customFrom);
    setModalTo(customTo);
    setModalStatus("");
    setShowModal(true);
  };

  // apply modal filters then download
  const handleDownload = (format) => {
    let orders = recentOrders || [];

    if (modalStatus) {
      orders = orders.filter((o) => o.status === modalStatus);
    }

    if (modalRange !== "all" && modalRange !== "custom") {
      const params = buildDateParams(modalRange, "", "");
      if (params.startDate) {
        const from = new Date(params.startDate);
        orders = orders.filter((o) => new Date(o.createdAt) >= from);
      }
    } else if (modalRange === "custom") {
      const from = modalFrom ? new Date(modalFrom) : null;
      const to = modalTo ? new Date(modalTo + "T23:59:59") : null;
      orders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    }

    if (orders.length === 0) {
      toast.error("No orders match the selected filters");
      return;
    }

    const label = getDateLabel(modalRange, modalFrom, modalTo);

    if (format === "excel") {
      generateSalesReportExcel({
        stats: stats || {},
        orders,
        monthlyData: chartData || [],
        dateLabel: label,
      });
      toast.success(`Excel downloaded (${orders.length} orders)`);
    } else {
      generateSalesReportPdf({
        mode: "admin",
        stats: stats || {},
        orders,
        monthlyData: chartData || [],
        dateLabel: label,
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
        <p className="text-red-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* date filter bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-6 flex flex-wrap items-center gap-2">
        <Calendar className="w-4 h-4 text-indigo-400 mr-1 shrink-0" />
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => { setActiveRange(r.value); if (r.value !== "custom") { setCustomFrom(""); setCustomTo(""); } }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeRange === r.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {r.label}
          </button>
        ))}

        {activeRange === "custom" && (
          <div className="flex items-center gap-2 ml-1">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-xs text-gray-400">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {(customFrom || customTo) && (
              <button
                onClick={() => { setCustomFrom(""); setCustomTo(""); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {activeRange !== "all" && (
          <span className="ml-auto text-xs text-indigo-500 font-medium">
            Showing: {getDateLabel(activeRange, customFrom, customTo)}
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-5 shadow text-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">₹{formatAmount(stats?.totalRevenue || 0)}</div>
              <div className="text-indigo-100 text-sm">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 shadow text-white">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
              <div className="text-purple-100 text-sm">Total Courses</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 shadow text-white">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
              <div className="text-green-100 text-sm">Students</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 shadow text-white">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalInstructors || 0}</div>
              <div className="text-orange-100 text-sm">Instructors</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 shadow text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <div className="text-blue-100 text-sm">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-5 shadow text-white">
          <div className="flex items-center gap-3">
            <RefreshCcw className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats?.totalRefunds || 0}</div>
              <div className="text-red-100 text-sm">Refunds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Monthly Revenue</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", r: 5 }}
                name="Revenue (₹)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No orders in this period
                  </td>
                </tr>
              ) : (
                recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      #{order.razorpayOrderId?.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{order.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.courseIds?.length} course(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : order.status === "REFUNDED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{formatAmount(order.amount || order.originalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-indigo-50">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-gray-800">Download Report</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                      onClick={() => setModalStatus(opt.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        modalStatus === opt.value
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
                      onClick={() => { setModalRange(r.value); if (r.value !== "custom") { setModalFrom(""); setModalTo(""); } }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        modalRange === r.value
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
              {modalRange === "custom" && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={modalFrom}
                        onChange={(e) => setModalFrom(e.target.value)}
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
                        value={modalTo}
                        onChange={(e) => setModalTo(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Filters apply to the currently loaded orders from the dashboard view.
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
    </div>
  );
};

export default AdminDashboard;
