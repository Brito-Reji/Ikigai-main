import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useRedux.js";
import { BookOpen, Users, DollarSign, TrendingUp, Plus, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import SalesChart from "@/components/instructor/SalesChart.jsx";
import ReviewStats from "@/components/instructor/ReviewStats.jsx";
import api from "@/api/axiosConfig";
import toast from "react-hot-toast";

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [reviews] = useState({
    total: 0,
    star1: 0,
    star2: 0,
    star3: 0,
    star4: 0,
    star5: 0,
  });

  // fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await api.get("/instructor/dashboard/stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const response = await api.get(`/instructor/dashboard/transactions?page=${pagination.page}&limit=${pagination.limit}`);
        if (response.data.success) {
          setTransactions(response.data.data.transactions);
          setPagination(prev => ({
            ...prev,
            ...response.data.data.pagination,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString("en-IN") || 0}`;
  };

  const getStatusBadge = (status) => {
    if (status === "PAID") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Paid</span>;
    } else if (status === "REFUNDED") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Refunded</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
  };

  const getEscrowBadge = (releaseStatus) => {
    if (releaseStatus === "HELD") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Held</span>;
    } else if (releaseStatus === "RELEASED") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Released</span>;
    } else if (releaseStatus === "REFUNDED") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Refunded</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Pending</span>;
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
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

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <span className="text-sm text-gray-500">
              {pagination.total} total transactions
            </span>
          </div>

          {transactionsLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading transactions...
            </div>
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
                          <div>
                            <p className="font-medium text-gray-900">{txn.student.name}</p>
                            <p className="text-sm text-gray-500">{txn.student.email}</p>
                          </div>
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
                        <td className="py-4 px-4">
                          {getStatusBadge(txn.status)}
                        </td>
                        <td className="py-4 px-4">
                          {getEscrowBadge(txn.releaseStatus)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatDate(txn.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transactions yet
              </h3>
              <p className="text-gray-500">
                Your course sales will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
