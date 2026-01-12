import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Star,
  BookOpen,
  Video,
  FileText,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useInstructorCourse, useApplyVerification, useTogglePublish } from "@/hooks/useCourses.js";
import ChapterManager from "@/components/instructor/ChapterManager.jsx";
import Swal from "sweetalert2";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading: courseLoading } = useInstructorCourse(courseId);
  const applyVerificationMutation = useApplyVerification();
  const togglePublishMutation = useTogglePublish();

  const handleApplyForVerification = async () => {
    const result = await Swal.fire({
      title: "Apply for Verification?",
      text: "Your course will be reviewed by our admin team for verification.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, apply!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await applyVerificationMutation.mutateAsync(courseId);

        Swal.fire({
          icon: "success",
          title: "Done!",
          text: "Verification request submitted",
          confirmButtonColor: "#14b8a6",
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: error.response?.data?.message || "Something went wrong",
          confirmButtonColor: "#ef4444"
        });
      }
    }
  };

  const handleTogglePublish = async () => {
    const result = await Swal.fire({
      title: course.published ? "Unpublish Course?" : "Publish Course?",
      text: course.published
        ? "Students won't be able to see this course anymore"
        : "Your course will be visible to students",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: course.published ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: course.published ? "Yes, unpublish" : "Yes, publish",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await togglePublishMutation.mutateAsync(courseId);

        Swal.fire({
          icon: "success",
          title: "Done!",
          text: course.published ? "Course unpublished" : "Course published successfully",
          confirmButtonColor: "#10b981",
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: error.response?.data?.message || "Something went wrong",
          confirmButtonColor: "#ef4444"
        });
      }
    }
  };

  const getVerificationBadge = () => {
    if (!course) return null;

    const status = course.verificationStatus;

    const badges = {
      pending: {
        icon: <AlertCircle className="w-4 h-4" />,
        text: "Not Verified",
        className: "bg-gray-100 text-gray-800"
      },
      inprocess: {
        icon: <Clock className="w-4 h-4" />,
        text: "Verification Pending",
        className: "bg-blue-100 text-blue-800"
      },
      verified: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Verified",
        className: "bg-green-100 text-green-800"
      },
      rejected: {
        icon: <XCircle className="w-4 h-4" />,
        text: "Verification Rejected",
        className: "bg-red-100 text-red-800"
      }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1 ${badge.className}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  if (courseLoading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData?.data) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600">Course not found</div>
      </div>
    );
  }

  const course = courseData.data;

  const handleBack = () => {
    navigate("/instructor/courses");
  };

  const handleEditCourse = () => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  const handleAddChapter = () => {
    console.log("Add chapter");
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    course.blocked
                      ? "bg-red-100 text-red-800"
                      : course.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {course.blocked
                    ? "Blocked"
                    : course.published
                      ? "Published"
                      : "Draft"}
                </span>

                {getVerificationBadge()}
              </div>
              <p className="text-gray-600">{course.description}</p>
              {course.verificationStatus === "rejected" &&
                course.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong>{" "}
                      {course.rejectionReason}
                    </p>
                  </div>
                )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {/* Apply for Verification - shows when in draft and not yet applied or rejected */}
              {!course.published &&
                (course.verificationStatus === "pending" ||
                  course.verificationStatus === "rejected") && (
                  <button
                    onClick={handleApplyForVerification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply for Verification
                  </button>
                )}

              {/* Publish - shows when verified but not published */}
              {!course.published &&
                course.verificationStatus === "verified" && (
                  <button
                    onClick={handleTogglePublish}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </button>
                )}

              {/* Unpublish - shows when course is published */}
              {course.published && (
                <button
                  onClick={handleTogglePublish}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Unpublish
                </button>
              )}

              <button
                onClick={handleEditCourse}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{course.price}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="text-lg font-bold text-gray-900">
                  {course.category?.name || "N/A"}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {course.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Verification</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {course.verificationStatus}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                {course.verificationStatus === "verified" ? (
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                ) : (
                  <Clock className="w-6 h-6 text-purple-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <ChapterManager courseId={courseId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Thumbnail */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                  Change Thumbnail
                </button>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Course Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Actual Price</p>
                  <p className="font-semibold text-gray-900">
                    ₹{course.actualPrice}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Discount</p>
                  <p className="font-semibold text-gray-900">
                    {course.discountType === "none"
                      ? "No discount"
                      : course.discountType === "percentage"
                        ? `${course.discountValue}%`
                        : `₹${course.discountValue}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Final Price</p>
                  <p className="font-semibold text-gray-900">₹{course.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  View Analytics
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  Manage Students
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  View Reviews
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
