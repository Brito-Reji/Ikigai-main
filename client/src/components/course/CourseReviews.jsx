import React, { useState } from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';

const CourseReviews = ({ course }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock reviews data - in real app, this would come from API
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
      rating: 5,
      date: "2 months ago",
      review: "This course exceeded my expectations! The instructor explains complex concepts in a very clear and engaging way. The hands-on projects really helped me understand UX design principles.",
      helpful: 24,
      verified: true
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      rating: 4,
      date: "3 weeks ago",
      review: "Great course overall. The content is well-structured and the examples are practical. I would have liked more advanced topics, but it's perfect for beginners.",
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      user: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      rating: 5,
      date: "1 month ago",
      review: "Absolutely fantastic! I went from knowing nothing about UX to feeling confident enough to start my own projects. The instructor is amazing and the community is very supportive.",
      helpful: 31,
      verified: true
    },
    {
      id: 4,
      user: "David Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
      rating: 4,
      date: "2 weeks ago",
      review: "Good course with solid fundamentals. The pace is just right and the assignments are challenging but doable. Definitely recommend for anyone starting in UX design.",
      helpful: 12,
      verified: false
    },
    {
      id: 5,
      user: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
      rating: 5,
      date: "1 week ago",
      review: "This course changed my career! I was able to transition from graphic design to UX design thanks to the comprehensive curriculum and practical approach.",
      helpful: 8,
      verified: true
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 75 },
    { stars: 4, count: 38, percentage: 18 },
    { stars: 3, count: 12, percentage: 6 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const averageRating = 4.7;
  const totalReviews = 208;

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-2">{averageRating}</div>
          <div className="flex items-center justify-center mb-2">
            {renderStars(Math.floor(averageRating))}
          </div>
          <p className="text-gray-600">{totalReviews} reviews</p>
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
                    className="bg-yellow-400 h-2 rounded-full"
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
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <img
                src={review.avatar}
                alt={review.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.user}</h4>
                    {review.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">{review.review}</p>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                    <Flag className="w-4 h-4 mr-1" />
                    <span className="text-sm">Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseReviews;