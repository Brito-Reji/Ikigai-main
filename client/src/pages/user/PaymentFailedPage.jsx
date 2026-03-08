import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { XCircle, Home, RefreshCcw, AlertCircle, ArrowRight, Tag, Wallet } from "lucide-react";
import PaymentFailureCard from "@/components/common/PaymentFailureCard";
import { retryPayment } from "@/services/razorpayService";
import { useVerifyPayment } from "@/hooks/useCourses";

export default function PaymentFailedPage() {
  const verifyPaymentMutation = useVerifyPayment();
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};
  let  enrolledDetails = stateData.enrolledDetails;
  enrolledDetails = {
    ...enrolledDetails,
    amount: enrolledDetails.amount/100,
    courseIds: enrolledDetails.courseIds.map((course) => {return {...course, price: course.price/100}}),
    originalAmount: enrolledDetails.originalAmount/100,
    discountAmount: enrolledDetails.discountAmount/100,
    walletAmountUsed: enrolledDetails.walletAmountUsed/100,
  }
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    console.log("Payment Failed Page - State:", stateData);
    console.log("Enrolled Details:", enrolledDetails);
    
    if (enrolledDetails?.courseIds) {
      setCourses(enrolledDetails.courseIds);
    }
  }, [stateData]);

  const handleRetry = () => {
    const response = retryPayment(stateData.orderId, navigate, verifyPaymentMutation);
 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full shadow-xl mb-6 ring-4 ring-red-100">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We couldn't process your payment. Don't worry, you haven't been charged. 
            Please try again.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-8 space-y-8">
            {courses.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 px-6 py-4">
                  <h2 className="text-xl text-white font-bold flex items-center">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    Courses in Your Order
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {courses.map((course, index) => (
                    <PaymentFailureCard key={index} course={course} />
                  ))}
                </div>
              </div>
            )}

            {enrolledDetails && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 transform transition-all hover:shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Original Price</span>
                    <span>₹{enrolledDetails.originalAmount?.toFixed(2)}</span>
                  </div>

                  {enrolledDetails.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-medium">
                      <span className="flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Coupon Applied ({enrolledDetails.couponCode})
                      </span>
                      <span>-₹{enrolledDetails.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}

                  {enrolledDetails.walletAmountUsed > 0 && (
                    <div className="flex justify-between text-indigo-600 font-medium pb-4 border-b border-gray-100">
                      <span className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Wallet Deducted
                      </span>
                      <span>-₹{enrolledDetails.walletAmountUsed?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-end">
                    <span className="text-xl text-gray-900 font-bold">Total Amount to Pay</span>
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                      ₹{enrolledDetails.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-6 h-6" />
                Retry Payment
                <ArrowRight className="w-5 h-5 opacity-80" />
              </button>
              <Link to="/" className="flex-1">
                <button className="w-full bg-white text-gray-700 border-2 border-gray-200 py-4 px-6 rounded-2xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <Home className="w-6 h-6" />
                  Back to Home
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 shadow-lg shadow-amber-50/50">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900 mb-3">
                      Why did this happen?
                    </h3>
                    <ul className="text-base text-amber-800 space-y-2 list-disc list-inside marker:text-amber-500">
                      <li>Insufficient balance</li>
                      <li>Incorrect card details</li>
                      <li>Card expired or blocked</li>
                      <li>Bank server downtime</li>
                      <li>Network connection issues</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-indigo-100 p-2 rounded-xl mr-3">
                    <RefreshCcw className="w-6 h-6 text-indigo-600" />
                  </span>
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  If you continue to face issues, please contact our support team. 
                  We're here to help you 24/7.
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:support@ikigai.com" 
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-semibold bg-gray-50 text-indigo-900 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                  >
                    Email Support
                  </a>
                  <a 
                    href="/chat" 
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                  >
                    Live Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
