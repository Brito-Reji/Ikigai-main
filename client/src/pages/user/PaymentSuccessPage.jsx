import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Home, BookOpen, ArrowRight } from "lucide-react";
import PaymentSuccessCard from "@/components/common/PaymentSuccessCard";
import InvoiceSection from "@/components/common/InvoiceSection";
import DownloadInvoiceButton from "@/components/common/DownloadInvoiceButton";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};
  
  const paymentId = stateData.paymentId;
  const enrolledDetails = stateData.enrolledDetails;
  
  const courses = enrolledDetails?.courseIds || [];

  useEffect(() => {
    console.log("Payment Success Page - State:", stateData);
    console.log("PaymentId:", paymentId);
    console.log("EnrolledDetails:", enrolledDetails);
    console.log("Courses:", courses);
    
    if (!paymentId || !enrolledDetails || courses.length === 0) {
      console.warn("Missing payment data, redirecting to courses");
      navigate("/courses", { replace: true });
    }
  }, [paymentId, enrolledDetails, navigate, courses, stateData]);

  if (!paymentId || !enrolledDetails || courses.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl mb-6 ring-4 ring-green-100">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Congratulations! You've successfully enrolled in <span className="font-semibold text-gray-900">{courses.length} {courses.length === 1 ? 'course' : 'courses'}</span>. 
            Start learning right away!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h2 className="text-xl text-white font-bold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Enrolled Courses
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {courses.map((course, index) => (
                  <PaymentSuccessCard key={index} course={course} index={index} />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/my-courses" className="flex-1">
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Go to My Courses
                  <ArrowRight className="w-5 h-5 opacity-80" />
                </button>
              </Link>
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
              <InvoiceSection 
                paymentDetails={{ paymentId }} 
                courses={courses} 
              />
              <DownloadInvoiceButton 
                paymentDetails={{ paymentId }} 
                courses={courses} 
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 text-center border border-indigo-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            What's Next?
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Check your email for the receipt and course access details. You can start learning immediately from your dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-indigo-800 shadow-sm">
              ✓ Lifetime Access
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-purple-800 shadow-sm">
              ✓ Certificate of Completion
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-green-800 shadow-sm">
              ✓ 24/7 Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
