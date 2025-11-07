import React, { useState } from "react";
import { useAuth } from "@/hooks/useRedux.js";
import { BookOpen, Users, DollarSign, TrendingUp, Plus, MoreVertical } from "lucide-react";
import StatCard from "@/components/instructor/StatCard.jsx";
import ReviewStats from "@/components/instructor/ReviewStats.jsx";
import CourseCard from "@/components/instructor/CourseCard.jsx";
import SalesChart from "@/components/instructor/SalesChart.jsx";

export default function InstructorDashboard() {
  const { user } = useAuth();
  
  // Sample data - replace with actual API calls
  const [stats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    pendingCommission: 0,
  });

  const [reviews] = useState({
    total: 1000,
    star1: 100,
    star2: 100,
    star3: 100,
    star4: 100,
    star5: 100,
  });

  const [courses] = useState([
    {
      id: 1,
      title: "Beginner's Guide to Design",
      price: "₹50.00",
      chapters: 13,
      orders: 254,
      reviews: 25,
      rating: 4.5,
      status: "Free",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    },
    {
      id: 2,
      title: "Beginner's Guide to Design",
      price: "₹50.00",
      chapters: 13,
      orders: 254,
      reviews: 25,
      rating: 4.5,
      status: "Free",
      thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
    },
    {
      id: 3,
      title: "Beginner's Guide to Design",
      price: "₹50.00",
      chapters: 13,
      orders: 254,
      reviews: 25,
      rating: 4.5,
      status: "Free",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    },
  ]);

  const handleAddCourse = () => {
    // Navigate to create course page
    console.log("Add course clicked");
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
            >
              Add Course
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">₹1K</span>
            </div>
            <p className="text-sm text-gray-600">Life Time Courses Commission</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">₹800.0</span>
            </div>
            <p className="text-sm text-gray-600">Life Time Received Commission</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">₹200.00</span>
            </div>
            <p className="text-sm text-gray-600">Life Time Pending Commission</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="mb-8">
          <SalesChart />
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <ReviewStats reviews={reviews} />
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
            <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
              View All
            </button>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first course to start teaching
              </p>
              <button
                onClick={handleAddCourse}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

