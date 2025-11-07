import { Star } from "lucide-react";

export default function ReviewStats({ reviews }) {
  const ratingColors = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-lime-500",
    5: "bg-green-500",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900">{reviews.total}</p>
        </div>
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="text-center">
            <p className="text-sm text-gray-600 mb-2">{rating} star reviews</p>
            <div className="flex items-center justify-center">
              <p className="text-2xl font-bold text-gray-900 mr-2">
                {reviews[`star${rating}`] || 0}
              </p>
              <span className={`px-2 py-1 rounded text-white text-xs ${ratingColors[rating]}`}>
                {rating}★
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
