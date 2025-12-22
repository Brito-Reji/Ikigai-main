import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Tag, X, ShoppingBag, Lock, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useRedux";
import { startRazorpayPayment } from "@/services/razorpayService";
import api from "@/api/axiosConfig";
import toast from "react-hot-toast";
import { useVerifyPayment } from "@/hooks/useCourses.js";

const CheckoutPage = () => {
  const verifyPaymentMutation = useVerifyPayment();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: cartItems, dispatch } = useCart();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const courseId = searchParams.get("courseId");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        if (courseId) {
          // Scenario 1: Single Course Checkout via URL
          const response = await api.get(`/public/courses/${courseId}`);
          if (response.data.success) {
            setCourses([response.data.data]);
          }
        } else if (cartItems.length > 0) {
          // Scenario 2: Cart Checkout
          setCourses(cartItems);
        } else {
          // Empty state - redirect to cart
          navigate("/cart");
        }
      } catch (error) {
        console.error("Failed to load checkout details:", error);
        toast.error("Failed to load course details");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [courseId, cartItems, navigate]);

  const calculateSubtotal = () => {
    return courses.reduce((total, course) => {
      const price = typeof course.price === 'number' ? course.price : parseFloat(course.price) || 0;
      return total + price;
    }, 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();

    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.value) / 100;
    } else {
      return appliedCoupon.value;
    }
  };

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);

    // Simulate API validation for coupon
    setTimeout(() => {
      const mockCoupons = {
        "SAVE10": { code: "SAVE10", type: "percentage", value: 10, description: "10% Discount" },
        "SAVE20": { code: "SAVE20", type: "percentage", value: 20, description: "20% Discount" },
        "FLAT100": { code: "FLAT100", type: "fixed", value: 100, description: "₹100 Flat Off" },
        "WELCOME50": { code: "WELCOME50", type: "percentage", value: 50, description: "Welcome Offer 50% Off" },
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];

      if (coupon) {
        setAppliedCoupon(coupon);
        toast.success(`Coupon "${coupon.code}" applied!`);
      } else {
        toast.error("Invalid coupon code");
      }

      setCouponLoading(false);
    }, 600);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handlePayment = async () => {
    try {
      console.log("handlePayment triggered");
      console.log("Courses in state:", courses);

      const courseIds = courses.map(c => c._id).filter(id => id);
      console.log("Derived courseIds:", courseIds);

      if (courseIds.length === 0) {
        toast.error("No valid courses found to checkout");
        return;
      }

      setProcessing(true);

      // Initialize Razorpay payment
      await startRazorpayPayment(courseIds, navigate, verifyPaymentMutation);

     


    } catch (error) {
      console.error("Checkout Payment error:", error);
      toast.error("Payment was cancelled or failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button
          onClick={() => navigate(courseId ? -1 : "/cart")}
          className="group flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow mr-3 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to {courseId ? "Course" : "Cart"}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
                <h1 className="text-xl text-white font-bold flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Order Details
                </h1>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div key={course._id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex-shrink-0">
                        <img
                          src={course.thumbnail || "https://placehold.co/600x400/png"}
                          alt={course.title}
                          className="w-full sm:w-32 h-20 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          By {course.instructor?.firstName} {course.instructor?.lastName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.category?.name || "General"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-indigo-600">
                          ₹{typeof course.price === 'number' ? course.price.toFixed(2) : course.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Secure Badge */}
            <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-center gap-3 text-indigo-700 border border-indigo-100">
              <Lock className="w-5 h-5" />
              <span className="font-medium text-sm">Payments are SSL encrypted and 100% secure</span>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-indigo-500" />
                Coupon Code
              </h3>

              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-green-700">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Code"
                      className="flex-1 uppercase bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {/* Coupon hints */}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCouponCode("SAVE10")} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded border border-gray-200 transition-colors">SAVE10</button>
                    <button onClick={() => setCouponCode("WELCOME50")} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded border border-gray-200 transition-colors">WELCOME50</button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

              <h3 className="text-lg font-bold text-gray-900 mb-6 relative">Summary</h3>

              <div className="space-y-4 mb-6 relative">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({courses.length} items)</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Discount
                    </span>
                    <span>-₹{calculateDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Proceed to Pay</span>
                    <CreditCard className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                By purchasing, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
