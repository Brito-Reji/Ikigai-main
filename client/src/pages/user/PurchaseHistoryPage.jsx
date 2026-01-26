import React, { useState, useEffect } from "react";
import { ArrowLeft, Tag, Calendar, CreditCard, RefreshCcw, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig.js";
import { refundApi } from "@/api/refundApi.js";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PurchaseHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payments/orders");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundCourse = async (order, courseId, courseTitle, originalPrice) => {
    // calc proportional refund
    let refundAmount = originalPrice;
    if (order.discountAmount && order.originalAmount) {
      const discount = Math.round((originalPrice / order.originalAmount) * order.discountAmount);
      refundAmount = originalPrice - discount;
    }

    const result = await Swal.fire({
      title: "Request Refund?",
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Course:</strong> ${courseTitle}</p>
          <p class="mb-2"><strong>Original Price:</strong> ₹${originalPrice}</p>
          ${order.discountAmount ? `<p class="mb-2 text-orange-600"><strong>Coupon Discount Applied:</strong> -₹${Math.round((originalPrice / order.originalAmount) * order.discountAmount)}</p>` : ""}
          <p class="text-lg font-bold text-green-600"><strong>Refund Amount:</strong> ₹${refundAmount}</p>
          <p class="mt-4 text-sm text-gray-500">Refund will be processed within 5-7 business days.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Request Refund",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setRefundLoading(courseId);
        const response = await refundApi.requestPartial({
          courseId,
          razorpayOrderId: order.razorpayOrderId,
          reason: "Customer request",
        });

        if (response.data.success) {
          toast.success(`Refund of ₹${response.data.refundAmount} processed!`);
          fetchOrders();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Refund failed");
      } finally {
        setRefundLoading(null);
      }
    }
  };

  const getPaymentStatus = (payment) => {
    if (payment.status === "REFUNDED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          <XCircle className="w-3 h-3" />
          Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            Purchase History
          </h1>
          <p className="text-gray-600 mt-1">View your orders and request refunds</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
            <p className="text-gray-500 mb-4">Start learning by purchasing your first course!</p>
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-white/80 text-sm">Order ID</p>
                      <p className="text-white font-mono text-sm">{order.razorpayOrderId}</p>
                    </div>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "REFUNDED" ? "bg-red-500/20 text-red-100" : "bg-green-500/20 text-green-100"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.courseIds.map((course) => {
                      const payment = order.payments?.find(p => p.courseId?.toString() === course._id?.toString());
                      const isRefunded = payment?.status === "REFUNDED";

                      return (
                        <div
                          key={course._id}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            isRefunded ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100"
                          }`}
                        >
                          <img
                            src={course.thumbnail || "https://placehold.co/100x60/png"}
                            alt={course.title}
                            className={`w-20 h-12 object-cover rounded ${isRefunded ? "opacity-50" : ""}`}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${isRefunded ? "text-gray-500 line-through" : "text-gray-900"}`}>
                              {course.title}
                            </h4>
                            <p className="text-sm text-gray-500">₹{course.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {getPaymentStatus(payment || { status: "PAID" })}
                            {!isRefunded && order.status === "PAID" && (
                              <button
                                onClick={() => handleRefundCourse(order, course._id, course.title, course.price)}
                                disabled={refundLoading === course._id}
                                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                              >
                                {refundLoading === course._id ? (
                                  <Clock className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCcw className="w-4 h-4" />
                                )}
                                Refund
                              </button>
                            )}
                            {isRefunded && payment?.refundAmount && (
                              <span className="text-sm text-gray-500">
                                Refunded: ₹{payment.refundAmount}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-1">
                        {order.couponCode && (
                          <p className="text-sm flex items-center gap-1 text-green-600">
                            <Tag className="w-4 h-4" />
                            Coupon: {order.couponCode} (-₹{order.discountAmount})
                          </p>
                        )}
                        {order.originalAmount && order.originalAmount !== order.amount && (
                          <p className="text-sm text-gray-500">
                            Original: ₹{order.originalAmount}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Amount Paid</p>
                        <p className="text-xl font-bold text-indigo-600">₹{order.amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
