import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ban, CheckCircle, Trash2 } from 'lucide-react';
import api from '@/api/axiosConfig.js';
import Swal from 'sweetalert2';

// Reuse user components
import CourseHero from '@/components/course/CourseHero.jsx';
import CourseSyllabus from '@/components/course/CourseSyllabus.jsx';
import InstructorInfo from '@/components/course/InstructorInfo.jsx';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/courses/${courseId}`);
      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch course details',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    const action = course?.blocked ? 'unblock' : 'block';
    
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} this course?`,
      text: `Are you sure you want to ${action} this course?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'block' ? '#eab308' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.patch(`/admin/courses/${courseId}/toggle-block`);
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: response.data.message,
            confirmButtonColor: '#14b8a6',
            timer: 2000
          });
          fetchCourseDetails();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update course status',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This course will be deleted. You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/admin/courses/${courseId}`);
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Course has been deleted successfully.',
            confirmButtonColor: '#14b8a6',
            timer: 2000
          });
          navigate('/admin/courses');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete course',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
        <button
          onClick={() => navigate('/admin/courses')}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'instructor', label: 'Instructor' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Actions Bar */}
      <div className="bg-white border-b border-gray-200 mb-6 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/courses')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleToggleBlock}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
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
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Hero Section */}
      <CourseHero course={course} />

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{course.overview}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600 mb-2">₹{course.price}</div>
                      <div className="text-sm text-gray-600">Current Price</div>
                      {course.actualPrice > course.price && (
                        <div className="text-xs text-gray-500 line-through mt-1">₹{course.actualPrice}</div>
                      )}
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{course.category?.name}</div>
                      <div className="text-sm text-gray-600">Category</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {course.published ? 'Published' : 'Draft'}
                      </div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                  </div>
                </div>
                
                <CourseSyllabus course={course} />
              </div>
            )}

            {activeTab === 'syllabus' && <CourseSyllabus course={course} />}
            {activeTab === 'instructor' && <InstructorInfo instructor={course.instructor} />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Course Status */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Course Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className={`font-medium ${course.published ? 'text-green-600' : 'text-yellow-600'}`}>
                      {course.published ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className={`font-medium ${course.blocked ? 'text-red-600' : 'text-green-600'}`}>
                      {course.blocked ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
