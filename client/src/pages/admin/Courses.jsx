import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Ban, 
  Trash2, 
  CheckCircle, 
  Clock,
  BookOpen,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCourse, useCategory } from '@/hooks/useRedux.js';
import { 
  fetchAdminCourses, 
  fetchCourseStatistics, 
  toggleCourseBlock, 
  deleteAdminCourse 
} from '@/store/slices/courseSlice.js';
import { fetchCategories } from '@/store/slices/categorySlice.js';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { adminCourses, pagination, statistics, adminLoading, adminError, dispatch: courseDispatch } = useCourse();
  const { categories, dispatch: categoryDispatch } = useCategory();

  // Get initial values from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch courses with filters
  const fetchCourses = (page = 1) => {
    courseDispatch(fetchAdminCourses({
      page,
      limit: 12,
      search: searchTerm,
      category: selectedCategory,
      status: selectedStatus
    }));
  };

  // Navigate to course details
  const viewCourseDetails = (courseId) => {
    window.location.href = `/admin/courses/${courseId}`;
  };

  // Toggle course block status
  const handleToggleBlock = async (courseId) => {
    try {
      await courseDispatch(toggleCourseBlock(courseId)).unwrap();
      alert('Course status updated successfully');
    } catch (error) {
      alert('Failed to update course status');
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await courseDispatch(deleteAdminCourse(courseId)).unwrap();
        alert('Course deleted successfully');
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedStatus) params.status = selectedStatus;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedStatus, currentPage, setSearchParams]);

  useEffect(() => {
    fetchCourses(currentPage);
  }, [searchTerm, selectedCategory, selectedStatus, currentPage]);

  useEffect(() => {
    categoryDispatch(fetchCategories());
    courseDispatch(fetchCourseStatistics());
  }, []);

  const getStatusBadge = (course) => {
    if (course.blocked) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
        <Ban className="w-3 h-3 mr-1" />
        Blocked
      </span>;
    }
    if (course.published) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
        <CheckCircle className="w-3 h-3 mr-1" />
        Published
      </span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
      <Clock className="w-3 h-3 mr-1" />
      Draft
    </span>;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Course Management</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.totalCourses || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.publishedCourses || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.draftCourses || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Ban className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.blockedCourses || 0}</p>
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
              onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Course Cards */}
      {adminLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      ) : adminError ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{adminError}</p>
          <button 
            onClick={() => fetchCourses(currentPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : adminCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(course)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{course.category?.name}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ₹{course.price}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewCourseDetails(course._id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleToggleBlock(course._id)}
                      className={`px-3 py-2 text-sm rounded transition-colors flex items-center justify-center ${
                        course.blocked 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {course.blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}


    </div>
  );
};

export default Courses;