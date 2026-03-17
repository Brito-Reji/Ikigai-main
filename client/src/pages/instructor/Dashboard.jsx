import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useRedux.js";
import {
  BookOpen, Users, DollarSign, TrendingUp,
  ChevronLeft, ChevronRight, Download, Filter, Calendar, X
} from "lucide-react";
import SalesChart from "@/components/instructor/SalesChart.jsx";
import api from "@/api/axiosConfig";
import generateSalesReportPdf from "@/utils/generateSalesReportPdf";
import toast from "react-hot-toast";

// time range presets
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

export default function InstructorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    heldFunds: 0,
    releasedFunds: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // report modal state
  const [showModal, setShowModal] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [reportRange, setReportRange] = useState("all");
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

  // fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await api.get("/instructor/dashboard/stats");
        if (res.data.success) setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      try {
        const res = await api.get(
          `/instructor/dashboard/transactions?page=${pagination.page}&limit=${pagination.limit}`
        );
        if (res.data.success) {
          setTransactions(res.data.data.transactions);
          setPagination((prev) => ({ ...prev, ...res.data.data.pagination }));
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

  const formatCurrency = (amount) =>
    `₹${amount?.toLocaleString("en-IN") || 0}`;

  const getStatusBadge = (status) => {
    if (status === "PAID")
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Paid</span>;
    if (status === "REFUNDED")
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Refunded</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
  };

  const getEscrowBadge = (releaseStatus) => {
    if (releaseStatus === "HELD")
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Held</span>;
    if (releaseStatus === "RELEASED")
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Released</span>;
    if (releaseStatus === "REFUNDED")
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Refunded</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Pending</span>;
  };

  // apply filters and download PDF
  const handleDownload = async () => {
    // fetch all transactions for filtering (up to 500)
    let allTxns = transactions;
    try {
      const res = await api.get("/instructor/dashboard/transactions?page=1&limit=500");
      if (res.data.success) allTxns = res.data.data.transactions;
    } catch (_) {}

    // status filter
    if (reportStatus) {
      allTxns = allTxns.filter((t) => t.status === reportStatus);
    }

    // date filter
    if (reportRange !== "all" && reportRange !== "custom") {
      const range = getDateRange(reportRange);
      if (range) {
        allTxns = allTxns.filter((t) => {
          const d = new Date(t.date);
          return d >= range.from && d <= range.to;
        });
      }
    } else if (reportRange === "custom") {
      const from = reportStartDate ? new Date(reportStartDate) : null;
      const to = reportEndDate ? new Date(reportEndDate + "T23:59:59") : null;
      allTxns = allTxns.filter((t) => {
        const d = new Date(t.date);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      });
    }

    if (allTxns.length === 0) {
      toast.error("No transactions match the selected filters");
      return;
    }

    // fetch revenue stats + course revenue for PDF
    let revenueStats = {};
    let courseRevenue = [];
    try {
      const [statsRes, courseRes] = await Promise.all([
        api.get("/instructor/revenue/stats"),
        api.get("/instructor/revenue/by-course"),
      ]);
      if (statsRes.data.success) revenueStats = statsRes.data.data;
      if (courseRes.data.success) courseRevenue = courseRes.data.data;
    } catch (_) {}

    generateSalesReportPdf({
      mode: "instructor",
      stats: revenueStats,
      courses: courseRevenue,
    });

    toast.success(`Report downloaded (${allTxns.length} transactions)`);
    setShowModal(false);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-indigo-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : stats.totalCourses}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Courses</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : stats.totalStudents}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : formatCurrency(stats.totalRevenue)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : formatCurrency(stats.heldFunds)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Held in Escrow</p>
            <p className="text-xs text-gray-400 mt-1">Released after 7 days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : formatCurrency(stats.releasedFunds)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Available Balance</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="mb-8">
          <SalesChart />
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <span className="text-sm text-gray-500">{pagination.total} total transactions</span>
          </div>

          {transactionsLoading ? (
            <div className="text-center py-12 text-gray-500">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Course</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Payment</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Escrow</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{txn.student.name}</p>
                          <p className="text-sm text-gray-500">{txn.student.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {txn.course.thumbnail && (
                              <img
                                src={txn.course.thumbnail}
                                alt={txn.course.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">
                              {txn.course.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(txn.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(txn.status)}</td>
                        <td className="py-4 px-4">{getEscrowBadge(txn.releaseStatus)}</td>
                        <td className="py-4 px-4 text-gray-600">{formatDate(txn.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-500">Your course sales will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* header */}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "" },
                    { label: "Paid", value: "PAID" },
                    { label: "Refunded", value: "REFUNDED" },
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
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

              {/* custom dates */}
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

              <p className="text-xs text-gray-400">
                Report includes your revenue stats and course-level breakdown.
              </p>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
