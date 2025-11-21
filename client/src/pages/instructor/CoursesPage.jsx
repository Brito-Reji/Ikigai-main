import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CourseCard from "@/components/instructor/CourseCard.jsx";
import { useCourse } from "@/hooks/useRedux.js";
import { fetchInstructorCourses } from "@/store/slices/courseSlice.js";

export default function CoursesPage() {
  const navigate = useNavigate();
  const { instructorCourses, loading, error, dispatch } = useCourse();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch instructor courses on component mount
  useEffect(() => {
    console.log('Fetching instructor courses...');
    dispatch(fetchInstructorCourses());
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('Courses state:', { instructorCourses, loading, error });
  }, [instructorCourses, loading, error]);

  // Transform backend data to match component expectations
  const courses = instructorCourses.map(course => ({
    id: course._id,
    title: course.title,
    price: `₹${course.price}`,
    chapters: course.chapters || 0,
    orders: course.enrollments || 0,
    reviews: course.reviews || 0,
    rating: course.rating || 0,
    status: course.published ? "Published" : "Draft",
    students: course.enrollments || 0,
    revenue: `₹${(course.price * (course.enrollments || 0)).toLocaleString()}`,
    thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
    lastUpdated: new Date(course.updatedAt).toLocaleDateString(),
    description: course.description,
    overview: course.overview,
    category: course.category
  }));

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || course.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateCourse = () => {
    navigate("/instructor/courses/create");
  };

  const handleViewCourse = (courseId) => {
    navigate(`/instructor/courses/${courseId}`);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-1">
                Manage and track your courses • {courses.length} total courses
              </p>
            </div>
            <button
              onClick={handleCreateCourse}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Course
            </button>
          </div>

          {/* Stats Cards */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-gray-900">
                  {courses.length}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.status === "Published").length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-yellow-600">
                  {courses.filter(c => c.status === "Draft").length}
                </div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {courses.reduce((total, course) => total + course.students, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : ""}`}
                >
                  <Grid className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : ""}`}
                >
                  <List className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading courses...
            </h3>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-red-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading courses
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchInstructorCourses())}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="relative group">
                  <div onClick={() => handleViewCourse(course.id)} className="cursor-pointer">
                    <CourseCard course={course} />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white rounded-lg shadow-lg p-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/instructor/courses/${course.id}/edit`);
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCourse(course.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="View Course"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded" title="Delete Course">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.chapters} chapters
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ⭐ {course.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== "all" ? "No courses found" : "No courses yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first course to get started"
              }
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button
                onClick={handleCreateCourse}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
