import React from "react";
import { X, Lock, Loader2 } from "lucide-react";

export default function OrderPaymentModal({ isOpen, onClose, orderDetails, onPayment, isLoading }) {
  if (!isOpen) return null;

  // dummy fallback for preview
  const courses = orderDetails?.courseIds || orderDetails?.courses || [
    { _id: "1", title: "React Basics", price: 4900 },
    { _id: "2", title: "Node.js Complete Guide", price: 5900 },
  ];

  const coupon = orderDetails?.couponCode || orderDetails?.coupon || null;
  const originalAmount = orderDetails?.originalAmount ?? courses.reduce((s, c) => s + c.price, 0);
  const discountAmount = orderDetails?.discountAmount ?? 0;
  const walletUsed = orderDetails?.walletAmountUsed ?? 0;
  const totalPayment = orderDetails?.amount ?? (originalAmount - discountAmount - walletUsed);

  // amount is stored in paise (x100), normalize to rupees
  const toRupees = (val) => (val / 100).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Complete Your Payment</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Course list */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Courses</p>
            <ul className="space-y-2">
              {courses.map((course, i) => (
                <li key={course._id || i} className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm truncate pr-4">{course.title}</span>
                  <span className="text-gray-900 text-sm font-semibold whitespace-nowrap">
                    ₹{toRupees(course.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Summary breakdown */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{toRupees(originalAmount)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>
                  Coupon{" "}
                  {coupon && (
                    <span className="ml-1 px-1.5 py-0.5 bg-green-50 border border-green-100 rounded text-xs font-bold uppercase">
                      {coupon}
                    </span>
                  )}
                </span>
                <span>-₹{toRupees(discountAmount)}</span>
              </div>
            )}

            {walletUsed > 0 && (
              <div className="flex justify-between text-indigo-600">
                <span>Wallet Used</span>
                <span>-₹{toRupees(walletUsed)}</span>
              </div>
            )}

            {!coupon && discountAmount === 0 && (
              <div className="flex justify-between text-gray-400 italic">
                <span>Coupon</span>
                <span>None</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
              <span className="font-bold text-gray-800 text-base">Total</span>
              <span className="text-xl font-bold text-blue-600">₹{toRupees(totalPayment)}</span>
            </div>
          </div>
        </div>

        {/* Pay button */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onPayment}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-sm transition-all flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Opening Payment...</span>
              </>
            ) : (
              <>
                <span>Proceed to Pay</span>
                <span className="border-l border-blue-400/50 pl-2 ml-1 font-bold">
                  ₹{toRupees(totalPayment)}
                </span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <Lock size={11} />
            Secured by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
