import { Eye, CheckCheck, AlertCircle, XCircle } from "lucide-react";

const CourseCard = ({ course, onView }) => {
  const getStatusBadge = () => {
    if (course.blocked)
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          Blocked
        </span>
      );
    if (course.published)
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Published
        </span>
      );
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
        Draft
      </span>
    );
  };

  const getVerificationBadge = () => {
    if (course.verificationStatus === "verified")
      return (
        <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full flex items-center gap-1">
          <CheckCheck className="w-3 h-3" />
          Approved
        </span>
      );
    if (course.verificationStatus === "inprocess")
      return (
        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Awaiting approval
        </span>
      );
    if (course.verificationStatus === "rejected")
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover bg-gray-100"
        />
        <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
          {getStatusBadge()}
          {getVerificationBadge()}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <hr className="border-gray-100 mb-3" />

        {/* Category + Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {course.category?.name}
          </span>
          <span className="text-base font-medium text-blue-600">
            ₹{course.price}
          </span>
        </div>

        {/* Instructor */}
        <p className="text-xs text-gray-500 mb-3">
          {course.instructor?.firstName} {course.instructor?.lastName}
        </p>

        {/* Action */}
        <button
          onClick={() => onView(course._id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <Eye className="w-4 h-4" />
          View details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
