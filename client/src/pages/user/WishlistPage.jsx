import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { addToCart as addToCartRedux } from "@/store/slices/cartSlice";
import toast from "react-hot-toast";

const WishlistPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: wishlistData, isLoading } = useWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();
    const { mutate: addToCartAPI } = useAddToCart();
    const cartItems = useSelector((state) => state.cart.items);

    const wishlistItems = wishlistData?.data || [];

    const handleRemove = (courseId) => {
        removeFromWishlist(courseId, {
            onSuccess: () => {
                toast.success("Removed from wishlist");
            },
            onError: () => {
                toast.error("Failed to remove");
            }
        });
    };

    const handleAddToCart = (course) => {
        const isInCart = cartItems.some((item) => item._id === course.courseId._id);

        if (isInCart) {
            toast.error("Already in cart");
            return;
        }

        const courseData = {
            _id: course.courseId._id,
            title: course.courseId.title,
            price: course.courseId.price,
            thumbnail: course.courseId.thumbnail,
            instructor: course.courseId.instructor,
            category: course.courseId.category
        };

        addToCartAPI(course.courseId._id, {
            onSuccess: () => {
                dispatch(addToCartRedux(courseData));
                toast.success("Added to cart!");
            },
            onError: () => {
                toast.error("Failed to add to cart");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-6">Save courses you love!</p>
                    <button
                        onClick={() => navigate("/courses")}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-600 mt-2">{wishlistItems.length} courses</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="relative">
                                <img
                                    src={item.courseId?.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80"}
                                    alt={item.courseId?.title}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => navigate(`/course/${item.courseId._id}`)}
                                />
                            </div>

                            <div className="p-4">
                                <h3
                                    className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-red-500"
                                    onClick={() => navigate(`/course/${item.courseId._id}`)}
                                >
                                    {item.courseId?.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-3">
                                    By {item.courseId?.instructor?.firstName} {item.courseId?.instructor?.lastName}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-gray-900">₹{item.courseId?.price}</span>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>

                                    <button
                                        onClick={() => handleRemove(item.courseId._id)}
                                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
