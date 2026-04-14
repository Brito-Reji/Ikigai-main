import React, { useState } from "react";
import {
  Search,
  Ban,
  BookOpen,
  CheckCheck,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAdminCourses,
  useAdminCourseStatistics,
  useToggleCourseBlock,
  useDeleteAdminCourse,
} from "@/hooks/useAdminCourses.js";
import { useCategories } from "@/hooks/useCategories.js";
import Swal from "sweetalert2";
import CourseCard from "@/components/admin/courseCard.jsx";



const Courses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const { data: coursesData, isLoading: coursesLoading } = useAdminCourses({
    page: currentPage,
    limit: 12,
    search: searchTerm,
    category: selectedCategory,
    status: selectedStatus,
  });

  const { data: statisticsData } = useAdminCourseStatistics();
  const { data: categoriesData } = useCategories();

  const toggleBlockMutation = useToggleCourseBlock();
  const deleteMutation = useDeleteAdminCourse();

  const courses = coursesData?.data || [];
  const pagination = coursesData?.pagination || {};
  const statistics = statisticsData?.data || {};
  const categories = categoriesData?.categories || [];

  const updateFilters = newFilters => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.page) params.set("page", newFilters.page);
    setSearchParams(params);
  };

  const viewCourseDetails = courseId => {
    navigate(`/admin/courses/${courseId}`);
  };

  const handleToggleBlock = async courseId => {
    const course = courses.find(c => c._id === courseId);
    const action = course?.blocked ? "unblock" : "block";

    const result = await Swal.fire({
      title: `${action === "block" ? "Block" : "Unblock"} this course?`,
      text: `Are you sure you want to ${action} this course?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "block" ? "#eab308" : "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await toggleBlockMutation.mutateAsync(courseId);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || "Course status updated successfully",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.response?.data?.message || "Failed to update course status",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleDeleteCourse = async courseId => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This course will be deleted. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteMutation.mutateAsync(courseId);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.message || "Course has been deleted",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete course",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setCurrentPage(1);
    setSearchParams({});
  };

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Course Management
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.totalCourses || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Awaiting Approval
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.pendingCourses || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCheck className="w-8 h-8 text-teal-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.approvedCourses || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.rejectedCourses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Courses */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Ban className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.blockedCourses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  setCurrentPage(1);
                  updateFilters({
                    search: searchTerm,
                    category: selectedCategory,
                    status: selectedStatus,
                    page: 1,
                  });
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
              updateFilters({
                search: searchTerm,
                category: e.target.value,
                status: selectedStatus,
                page: 1,
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
              updateFilters({
                search: searchTerm,
                category: selectedCategory,
                status: e.target.value,
                page: 1,
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="inprocess">Awaiting Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onView={viewCourseDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  updateFilters({
                    search: searchTerm,
                    category: selectedCategory,
                    status: selectedStatus,
                    page: newPage,
                  });
                }}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  updateFilters({
                    search: searchTerm,
                    category: selectedCategory,
                    status: selectedStatus,
                    page: newPage,
                  });
                }}
                disabled={!pagination.hasNext}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
