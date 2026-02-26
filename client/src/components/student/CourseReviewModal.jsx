import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { useAddReview, useMyReview } from '@/hooks/useReview';

const CourseReviewModal = ({ isOpen, onClose, courseId, courseTitle }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const addReview = useAddReview();
  const { data: myReview } = useMyReview(isOpen ? courseId : null);

  // pre-fill if user already has a review
  useEffect(() => {
    if (myReview?.data) {
      setRating(myReview.data.rating);
      setReviewText(myReview.data.reviewText || '');
    } else {
      setRating(0);
      setReviewText('');
    }
  }, [myReview]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview.mutateAsync({ courseId, rating, reviewText });
      onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {myReview?.data ? 'Update Your Review' : 'Rate this Course'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-6 text-center">
            How would you rate <span className="font-semibold text-gray-900">{courseTitle}</span>?
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  } transition-colors duration-200`} 
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Write a Review (Optional)
            </label>
            <textarea
              id="review"
              rows={4}
              placeholder="What did you like or dislike? What did you use this course for?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || addReview.isPending}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {addReview.isPending ? 'Submitting...' : myReview?.data ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseReviewModal;
