import { Star, ShoppingCart } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-300 to-orange-400 overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100">
          <ShoppingCart className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2 group-hover:text-indigo-600 transition">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          By {course.instructor}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">({course.rating})</span>
        </div>

        {/* Hours and Price */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3">
          {course.hours} Total Hours
        </p>
        <div className="flex justify-between items-center">
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {course.price}
          </p>
          <button className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm font-medium">
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
