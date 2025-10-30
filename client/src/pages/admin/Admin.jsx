import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { BarChart3 } from "lucide-react";

// Sidebar Component (now uses navigate instead of setActivePage)
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/" },
    { id: "category", label: "Category", path: "/category" },
    { id: "students", label: "Students", path: "/students" },
    { id: "orders", label: "Orders", path: "/orders" },
    { id: "tutors", label: "Tutors", path: "/tutors" },
    { id: "coupons", label: "Coupons", path: "/coupons" },
    { id: "course", label: "Course", path: "/course" },
    { id: "report", label: "Report", path: "/report" },
    { id: "logout", label: "Logout", path: "/logout" },
  ];

  const activePage = location.pathname;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-800">Ikigai</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
              activePage === item.path
                ? "bg-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ value, label }) => {
  return (
    <div className="bg-gray-200 rounded-lg p-6">
      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

// Chart Component
const IncomeExpenseChart = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Income & Expanse
        </h2>
        <button className="text-gray-600 text-sm flex items-center gap-2">
          Date filter
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-800">₹77,000</div>
        <div className="text-gray-600 text-sm">Q9 Projects</div>
      </div>

      <div className="relative h-64">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="incomeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Income Line */}
          <path
            d="M 50 120 Q 150 140, 200 110 T 350 90 T 500 70 T 650 110 T 750 130"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Profit Line */}
          <path
            d="M 50 160 Q 150 150, 200 140 T 350 120 T 500 80 T 650 100 T 750 170"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data point */}
          <circle cx="500" cy="70" r="6" fill="#14b8a6" />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jul",
            "Jun",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-sm text-gray-600">Profit</span>
        </div>
      </div>
    </div>
  );
};

// Transaction Table Component
const TransactionTable = () => {
  const transactions = [
    {
      orderId: "#254841",
      customer: "Dianne Russell",
      type: "Student",
      date: "25 Jan 2022",
      status: "Received",
      commission: "95.00",
    },
    {
      orderId: "#254841",
      customer: "Bessie Cooper",
      type: "Teacher",
      date: "25 Jan 2022",
      status: "Pending",
      commission: "95.00",
    },
    {
      orderId: "#254841",
      customer: "Cameron Williamson",
      type: "Student",
      date: "25 Jan 2022",
      status: "Received",
      commission: "95.00",
    },
    {
      orderId: "#254841",
      customer: "Kathryn Murphy",
      type: "Teacher",
      date: "25 Jan 2022",
      status: "Received",
      commission: "95.00",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">All Transaction</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-t border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Commission
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.orderId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      transaction.status === "Received"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.commission}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Page Components (unchanged)
const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatsCard value="₹200" label="Total Revenue" />
        <StatsCard value="200" label="Total Course" />
        <StatsCard value="500" label="students" />
      </div>

      <div className="mb-8">
        <IncomeExpenseChart />
      </div>

      <TransactionTable />
    </div>
  );
};

const CategoryPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Category Management
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Manage your course categories here.</p>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Students</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">View and manage students here.</p>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Orders</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Manage all orders here.</p>
      </div>
    </div>
  );
};

const TutorsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tutors</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Manage tutors here.</p>
      </div>
    </div>
  );
};

const CouponsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Coupons</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">
          Create and manage discount coupons here.
        </p>
      </div>
    </div>
  );
};

const CoursePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Courses</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Manage all courses here.</p>
      </div>
    </div>
  );
};

const ReportPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Reports</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">
          View detailed reports and analytics here.
        </p>
      </div>
    </div>
  );
};

const LogoutPage = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Logout</h1>
        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
        <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600">
          Confirm Logout
        </button>
      </div>
    </div>
  );
};

// Layout with Sidebar and Outlet
const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
};

// Main App Component

