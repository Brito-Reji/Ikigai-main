import { useNavigate, Link } from "react-router-dom";
import { Ban, Home, ShoppingBag, ArrowRight } from "lucide-react";

export default function PaymentCancelledPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full shadow-xl mb-6 ring-4 ring-gray-200">
            <Ban className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You cancelled the payment process. No charges were made to your account.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10 text-center transform transition-all hover:shadow-2xl">
            <div className="max-w-lg mx-auto space-y-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Your cart is waiting
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                The courses you selected are still available in your cart. You can come back and complete the purchase whenever you're ready.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate("/cart")}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <ShoppingBag className="w-6 h-6" />
              View Cart
              <ArrowRight className="w-5 h-5 opacity-80" />
            </button>
            <Link to="/" className="flex-1">
              <button className="w-full bg-white text-gray-700 border-2 border-gray-200 py-4 px-6 rounded-2xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <Home className="w-6 h-6" />
                Back to Home
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-3xl p-8 text-center border border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Continue Exploring
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Discover thousands of courses in various categories. Find the perfect course for your learning goals.
            </p>
            <Link to="/courses">
              <button className="inline-flex items-center px-8 py-3 rounded-xl text-base font-semibold bg-white text-indigo-700 border border-indigo-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                Browse All Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
