import React, { useState } from "react";
import { Star } from "lucide-react";
import { usePublicCourseReviews } from "@/hooks/useCourses";

const CourseReviews = ({ course }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { data: reviewsData, isLoading } = usePublicCourseReviews(course?._id);

  const reviews = reviewsData?.data?.reviews || [];
  const averageRating = reviewsData?.data?.averageRating || 0;
  const totalReviews = reviewsData?.data?.totalReviews || 0;
  const ratingDistribution = reviewsData?.data?.ratingDistribution || [];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>

      {totalReviews === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to review this course</p>
        </div>
      ) : (
        <>
          {/* Rating Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.floor(averageRating))}
              </div>
              <p className="text-gray-600">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center">
                  <div className="flex items-center w-20">
                    {renderStars(item.stars)}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start space-x-4">
                  {review.user?.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-600">
                      {review.user?.firstName?.[0] || "?"}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.user?.firstName} {review.user?.lastName}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.reviewText && (
                      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less */}
          {reviews.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showAllReviews ? "Show Less Reviews" : `Show All ${reviews.length} Reviews`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseReviews;