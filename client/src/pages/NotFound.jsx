import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[180px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-indigo-400 opacity-20 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have gone on a learning journey of its own.
          </p>
          <p className="text-gray-500">
            Don't worry, there are plenty of other courses to explore!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <Link
            to="/courses"
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium w-full sm:w-auto justify-center"
          >
            <Search className="w-5 h-5" />
            <span>Browse Courses</span>
          </Link>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            While you're here, you might want to:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <Link
              to="/courses"
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Explore Courses</h3>
                  <p className="text-sm text-gray-600">Discover new skills and knowledge</p>
                </div>
              </div>
            </Link>

            <Link
              to="/"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Home className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visit Homepage</h3>
                  <p className="text-sm text-gray-600">Start your learning journey</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
