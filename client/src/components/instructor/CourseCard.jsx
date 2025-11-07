import { BookOpen, Users, ShoppingCart, Star } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative">
        <span className="absolute top-2 left-2 px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
          {course.status || "Free"}
        </span>
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
