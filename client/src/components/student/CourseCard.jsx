import { useCart } from "@/hooks/useRedux";
import { useAddToCart } from "@/hooks/useCart";
import { addToCart as addToCartRedux } from "@/store/slices/cartSlice";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import WishlistHeart from "@/components/common/WishlistHeart";
import toast from "react-hot-toast";

export default function CourseCard({ course }) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { items, dispatch } = useCart();
  const user = useSelector((state) => state.auth.user);
  const { mutate: addToCartAPI, isPending } = useAddToCart();

  // const isInCart = items.some((item) => item._id === course._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // if (isInCart) {
    //   toast.error("Already in cart");
    //   return;
    // }

    const courseData = {
      _id: course._id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      category: course.category
    };

    if (user && user.id) {
      // authenticated - call API
      addToCartAPI(course._id, {
        onSuccess: () => {
          dispatch(addToCartRedux(courseData));
          setNotificationMessage("Added to cart!");
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 2000);
        },
        onError: (error) => {
          const message = error.response?.data?.message || "Failed to add";
          toast.error(message);
        }
      });
    } else {
      // guest - localStorage only
      dispatch(addToCartRedux(courseData));
      setNotificationMessage("Added to cart!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative">
      {showNotification && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">{notificationMessage}</span>
        </div>
      )}

      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-300 to-orange-400 overflow-hidden">
        <img
          src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <WishlistHeart
          courseId={course._id}
          className="absolute top-3 left-3 z-10"
        />

        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 z-10 ${false
            ? "bg-green-500 opacity-100 scale-110"
            : "bg-blue-600 opacity-0 group-hover:opacity-100 hover:bg-blue-700"
            }`}
        >
          {false ? (
            <Check className="w-4 h-4 text-white" />
          ) : isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2 group-hover:text-indigo-600 transition">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          By {course.instructor?.firstName} {course.instructor?.lastName}
        </p>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(course.rating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
                }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">({course.rating || 0})</span>
        </div>

        {course.category && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3">
            {course.category}
          </p>
        )}
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
