import { Star, ShoppingCart, Check, Heart } from "lucide-react";
import { useState } from "react";

export default function CourseCard({ course }) {
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!isInCart) {
      setIsInCart(true);
      setNotificationMessage("Added to cart!");
      setShowNotification(true);
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      
      // You can add your cart logic here
      console.log("Added to cart:", course.title);
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation(); // Prevent card click event
    
    setIsInWishlist(!isInWishlist);
    setNotificationMessage(isInWishlist ? "Removed from wishlist" : "Added to wishlist!");
    setShowNotification(true);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    
    // You can add your wishlist logic here
    console.log(isInWishlist ? "Removed from wishlist:" : "Added to wishlist:", course.title);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative">
      {/* Notification */}
      {showNotification && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">{notificationMessage}</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-300 to-orange-400 overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button - Top Left */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-300 ${
            isInWishlist 
              ? "bg-red-500 opacity-100 scale-110" 
              : "bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-white"
          }`}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isInWishlist 
                ? "text-white fill-white" 
                : "text-red-500"
            }`}
          />
        </button>

        {/* Cart Button - Top Right */}
        <button 
          onClick={handleAddToCart}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 ${
            isInCart 
              ? "bg-green-500 opacity-100 scale-110" 
              : "bg-blue-600 opacity-0 group-hover:opacity-100 hover:bg-blue-700"
          }`}
        >
          {isInCart ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <ShoppingCart className="w-4 h-4 text-white" />
          )}
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
