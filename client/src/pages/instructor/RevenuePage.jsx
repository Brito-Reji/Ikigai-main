import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import api from "@/api/axiosConfig";
import RevenueStats from "@/components/instructor/RevenueStats.jsx";
import RevenueChart from "@/components/instructor/RevenueChart.jsx";
import CourseRevenue from "@/components/instructor/CourseRevenue.jsx";

// api
const fetchRevenueStats = async () => {
  const { data } = await api.get("/instructor/revenue/stats");
  return data.data;
};

const fetchMonthlyRevenue = async (year) => {
  const { data } = await api.get(`/instructor/revenue/monthly?year=${year}`);
  return data.data;
};

const fetchCourseRevenue = async () => {
  const { data } = await api.get("/instructor/revenue/by-course");
  return data.data;
};

export default function RevenuePage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["revenueStats"],
    queryFn: fetchRevenueStats,
  });

  // monthly
  const { data: monthlyData = [], isLoading: monthlyLoading } = useQuery({
    queryKey: ["monthlyRevenue", selectedYear],
    queryFn: () => fetchMonthlyRevenue(selectedYear),
  });

  // courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courseRevenue"],
    queryFn: fetchCourseRevenue,
  });

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue</h1>
          </div>
          
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <RevenueStats stats={stats} loading={statsLoading} />
        </div>

        {/* Monthly Chart */}
        <div className="mb-8">
          <RevenueChart data={monthlyData} loading={monthlyLoading} year={selectedYear} />
        </div>

        {/* Course Revenue Table */}
        <div className="mb-8">
          <CourseRevenue courses={courses} loading={coursesLoading} />
        </div>
      </div>
    </div>
  );
}

