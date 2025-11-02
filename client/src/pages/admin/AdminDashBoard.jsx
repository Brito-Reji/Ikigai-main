import React from "react";
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

const incomeExpenseData = [
  { month: "Jan", income: 70, profit: 40 },
  { month: "Feb", income: 60, profit: 45 },
  { month: "Mar", income: 75, profit: 42 },
  { month: "Apr", income: 85, profit: 38 },
  { month: "May", income: 82, profit: 55 },
  { month: "Jun", income: 77, profit: 75 },
  { month: "Jul", income: 60, profit: 65 },
  { month: "Aug", income: 70, profit: 85 },
  { month: "Sep", income: 95, profit: 55 },
  { month: "Oct", income: 80, profit: 70 },
  { month: "Nov", income: 75, profit: 50 },
  { month: "Dec", income: 72, profit: 25 },
];

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

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-gray-800">₹200</div>
          <div className="text-gray-600 mt-2">Total Revenue</div>
        </div>
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-gray-800">200</div>
          <div className="text-gray-600 mt-2">Total Course</div>
        </div>
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-gray-800">500</div>
          <div className="text-gray-600 mt-2">students</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Income & Expanse
          </h2>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <span>Date filter</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 6 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={false}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Profit</span>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-semibold text-gray-800">₹77,000</div>
            <div className="text-sm text-gray-500">09 Projects</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            All Transaction
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "Received"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.commission}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
