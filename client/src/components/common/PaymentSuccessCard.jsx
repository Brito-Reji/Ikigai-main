import { CheckCircle, Download } from "lucide-react";

export default function PaymentSuccessCard({ course, index }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <img
          src={course.thumbnail || "https://placehold.co/600x400/png"}
          alt={course.title}
          className="w-full sm:w-28 h-20 object-cover rounded-lg shadow-sm"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          By {course.instructor?.firstName} {course.instructor?.lastName}
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enrolled
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-base font-bold text-gray-900">
          ₹{typeof course.price === 'number' ? course.price.toFixed(2) : course.price}
        </p>
      </div>
    </div>
  );
}
