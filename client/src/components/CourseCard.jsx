
import { Star } from "lucide-react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
      <div className="h-48 bg-gradient-to-br from-orange-300 to-orange-400"></div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3">By {course.instructor}</p>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-xl font-bold text-gray-900">{course.price}</p>
      </div>
    </div>
  );
};

export default CourseCard;
