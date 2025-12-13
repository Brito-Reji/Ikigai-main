import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ban,
  CheckCircle,
  Trash2,
  CheckCheck,
  XCircle,
  Tag,
  Calendar,
  Mail,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Clock
} from 'lucide-react';
import {
  useAdminCourseDetails,
  useAdminCourseChapters,
  useToggleCourseBlock,
  useDeleteAdminCourse,
  useUpdateVerificationStatus
} from '@/hooks/useAdminCourses.js';
import Swal from 'sweetalert2';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [expandedChapters, setExpandedChapters] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch data using TanStack Query
  const { data: courseData, isLoading: courseLoading } = useAdminCourseDetails(courseId);
  const { data: chaptersData } = useAdminCourseChapters(courseId);

  // Mutations
  const toggleBlockMutation = useToggleCourseBlock();
  const deleteMutation = useDeleteAdminCourse();
  const updateVerificationMutation = useUpdateVerificationStatus();

  const course = courseData?.data;
  const chapters = chaptersData?.data || [];

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
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
        const response = await toggleBlockMutation.mutateAsync(courseId);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message,
          confirmButtonColor: '#14b8a6',
          timer: 2000
        });
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
        const response = await deleteMutation.mutateAsync(courseId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Course has been deleted successfully.',
          confirmButtonColor: '#14b8a6',
          timer: 2000
        });
        navigate('/admin/courses');
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

  const handleVerificationUpdate = async (status) => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please provide a rejection reason',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    const result = await Swal.fire({
      title: `${status === 'verified' ? 'Approve' : 'Reject'} this course?`,
      text: `Are you sure you want to ${status === 'verified' ? 'approve' : 'reject'} this course?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'verified' ? '#14b8a6' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${status === 'verified' ? 'approve' : 'reject'} it!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await updateVerificationMutation.mutateAsync({
          courseId,
          status,
          rejectionReason: status === 'rejected' ? rejectionReason : undefined
        });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message,
          confirmButtonColor: '#14b8a6',
          timer: 2000
        });
        setShowRejectModal(false);
        setRejectionReason('');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to update verification status',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
        <button
          onClick={() => navigate('/admin/courses')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${course.blocked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
              >
                {course.blocked ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Unblock
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Block
                  </>
                )}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              {course.verificationStatus === 'inprocess' && (
                <>
                  <button
                    onClick={() => handleVerificationUpdate('verified')}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Course</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this course:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerificationUpdate('rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedVideo(null)}>
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <video
              controls
              className="w-full rounded-lg"
              src={selectedVideo.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-6">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-48 h-32 object-cover rounded-lg shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-blue-100 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {course.category?.name}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Course Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
                  <p className="text-gray-700 leading-relaxed">{course.overview}</p>
                </div>

                {/* Pricing Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing Information</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">₹{course.actualPrice}</div>
                      <div className="text-sm text-gray-600">Actual Price</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">₹{course.price}</div>
                      <div className="text-sm text-gray-600">Current Price</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {course.discountType !== 'none' ? `${course.discountValue}${course.discountType === 'percentage' ? '%' : '₹'}` : 'None'}
                      </div>
                      <div className="text-sm text-gray-600">Discount</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {chapters.length} Chapters • {chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)} Lessons
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {chapters.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p>No chapters added yet</p>
                    </div>
                  ) : (
                    chapters.map((chapter, index) => (
                      <div key={chapter._id} className="p-4">
                        <button
                          onClick={() => toggleChapter(chapter._id)}
                          className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedChapters[chapter._id] ? (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Chapter {index + 1}: {chapter.title}
                              </h3>
                              {chapter.description && (
                                <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{chapter.lessons?.length || 0} lessons</span>
                        </button>

                        {expandedChapters[chapter._id] && chapter.lessons && (
                          <div className="ml-8 mt-2 space-y-2">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 flex-1">
                                  <PlayCircle className="w-4 h-4 text-blue-600" />
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {lessonIndex + 1}. {lesson.title}
                                    </h4>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lesson.duration > 0 && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  )}
                                  {lesson.videoUrl && (
                                    <button
                                      onClick={() => setSelectedVideo(lesson)}
                                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                    >
                                      Preview
                                    </button>
                                  )}
                                  {lesson.isFree && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Free</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && course.instructor && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Instructor Information</h2>
                <div className="flex items-start gap-6">
                  {course.instructor.profileImageUrl && (
                    <img
                      src={course.instructor.profileImageUrl}
                      alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </h3>
                    {course.instructor.headline && (
                      <p className="text-gray-600 mb-4">{course.instructor.headline}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      {course.instructor.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-lg shadow p-6">
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
                    <span className="text-gray-600">Verification:</span>
                    <span className={`font-medium capitalize ${course.verificationStatus === 'verified' ? 'text-teal-600' :
                        course.verificationStatus === 'rejected' ? 'text-red-600' :
                          course.verificationStatus === 'inprocess' ? 'text-orange-600' :
                            'text-gray-600'
                      }`}>
                      {course.verificationStatus === 'inprocess' ? 'Pending' : course.verificationStatus}
                    </span>
                  </div>
                  {course.verificationStatus === 'rejected' && course.rejectionReason && (
                    <div className="pt-3 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Rejection Reason:</span>
                      <p className="text-sm text-red-600 mt-1">{course.rejectionReason}</p>
                    </div>
                  )}
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
