import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png"
export default function AuthHeader({ showLoginLink = false, showSignupLink = false }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8  rounded-full flex items-center justify-center">
              <img src={logo} className="text-white font-bold text-sm"></img>
            </div>
            <span className="text-xl font-bold text-gray-900">Ikigai</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {showLoginLink && (
              <div className="text-sm text-gray-600">
                Already an instructor?{" "}
                <Link
                  to="/instructor/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}

            {showSignupLink && (
              <div className="text-sm text-gray-600">
                New instructor?{" "}
                <Link
                  to="/instructor/signup"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Student Login Link */}
            <div className="text-sm text-gray-600 hidden sm:block">
              Not an instructor?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
