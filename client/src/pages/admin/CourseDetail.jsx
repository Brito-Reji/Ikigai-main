import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Ban, 
  Trash2, 
  CheckCircle, 
  Clock,
  DollarSign,
  Calendar,
  User,
  BookOpen,
  Eye,
  Edit,
  Globe,
  Lock
} from 'lucide-react';
import api from '@/api/axiosConfig.js';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/courses/${courseId}`);
      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  // Toggle course block status
  const toggleCourseBlock = async () => {
    try {
      setActionLoading(true);
      const response = await api.patch(`/admin/courses/${courseId}/toggle-block`);
      if (response.data.success) {
        setCourse(response.data.data);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error toggling course block:', error);
      alert('Failed to update course status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setActionLoading(true);
        const response = await api.delete(`/admin/courses/${courseId}`);
        if (response.data.success) {
          alert('Course deleted successfully');
          navigate('/admin/courses');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      } finally {
        setActionLoading(false);
      }
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const getStatusBadge = (course) => {
    if (course.blocked) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
          <Ban className="w-4 h-4 mr-2" />
          Blocked
        </span>
      );
    }
    if (course.published) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          <Globe className="w-4 h-4 mr-2" />
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
        <Clock className="w-4 h-4 mr-2" />
        Draft
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchCourseDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Course not found</p>
        <button 
          onClick={() => navigate('/admin/courses')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/courses')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <div className="flex items-center space-x-4">
              {getStatusBadge(course)}
              <span className="text-gray-500">
                Created on {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={toggleCourseBlock}
              disabled={actionLoading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 ${
                course.blocked 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {course.blocked ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Unblock Course
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Block Course
                </>
              )}
            </button>
            <button
              onClick={deleteCourse}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Image */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Thumbnail</h2>
            <img
              src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
            <p className="text-gray-700 leading-relaxed">{course.overview}</p>
          </div>

          {/* Course Analytics (Placeholder) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Enrollments</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">₹0</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-sm text-gray-600">Completions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold text-lg text-green-600">₹{course.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{course.category?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                {getStatusBadge(course)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructor</h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {course.instructor?.profileImageUrl ? (
                  <img 
                    src={course.instructor.profileImageUrl} 
                    alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
                <p className="text-sm text-gray-600">{course.instructor?.email}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Instructor Profile
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Preview Course
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit Course Details
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                View Course Content
              </button>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enrollments</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-semibold">0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;