import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useRedux";
import { removeFromCart, clearCart } from "@/store/slices/cartSlice";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, dispatch } = useCart();

  const handleRemoveItem = (courseId) => {
    dispatch(removeFromCart(courseId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      return total + price;
    }, 0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start adding courses to your cart!</p>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
              >
                {/* Course Image */}
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80"}
                  alt={course.title}
                  className="w-32 h-20 object-cover rounded"
                />

                {/* Course Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    By {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{course.category?.name}</p>
                </div>

                {/* Price & Remove */}
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    ₹{typeof course.price === 'number' ? course.price : course.price}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(course._id)}
                    className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/courses")}
                className="w-full mt-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Continue Shopping
              </button>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
