import { BookOpen, Users, ShoppingCart, Star } from "lucide-react";

export default function CourseCard({ course }) {
  // Get verification badge
  const getVerificationBadge = () => {
    const status = course.verificationStatus;

    const badges = {
      pending: {
        text: "Pending",
        className: "bg-gray-100 text-gray-800"
      },
      inprocess: {
        text: "Awaiting Approval",
        className: "bg-blue-100 text-blue-800"
      },
      verified: {
        text: "Verified",
        className: "bg-green-100 text-green-800"
      },
      rejected: {
        text: "Rejected",
        className: "bg-red-100 text-red-800"
      }
    };

    const badge = badges[status] || badges.pending;
    return { text: badge.text, className: badge.className };
  };

  const verificationBadge = getVerificationBadge();

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative">
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${course.status === "Published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
            }`}>
            {course.status}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${verificationBadge.className}`}>
            {verificationBadge.text}
          </span>
        </div>
        <img
          src={course.thumbnail || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-gray-900">{course.price}</span>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>{course.chapters} Chapters</span>
            </div>
            <div className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-1" />
              <span>{course.orders} Orders</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium text-gray-900">
              {course.rating || "0.0"}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              ({course.reviews} Reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
