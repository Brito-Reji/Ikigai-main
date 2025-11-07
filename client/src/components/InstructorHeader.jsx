"use client";
import { useState } from "react";
import { User, Menu, X, BookOpen, BarChart3, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useRedux.js";
import { logout } from "../store/slices/authSlice.js";
import { useDispatch } from "react-redux";

export default function InstructorHeader({ onMenuToggle, menuOpen }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/instructor/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <Link to="/instructor/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Ikigai Instructor
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/instructor/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/instructor/courses"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                My Courses
              </Link>
              <Link
                to="/instructor/communication"
                className="text-gray-700 hover:text-indigo-600 transition font-medium"
              >
                Communication
              </Link>
            </nav>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                    <User className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName || "Instructor"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/instructor/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/instructor/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/instructor/login">
                  <button className="hidden md:inline-block px-4 py-2 text-gray-700 hover:text-gray-900 transition font-medium text-sm border border-gray-300 rounded-lg">
                    Log In
                  </button>
                </Link>
                <Link to="/instructor/signup">
                  <button className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-30 overflow-y-auto">
          <nav className="px-4 py-6 space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/instructor/dashboard"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/instructor/courses"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>My Courses</span>
                </Link>
                <Link
                  to="/instructor/communication"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Communication</span>
                </Link>
                <Link
                  to="/instructor/settings"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || "Instructor"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 text-red-600 hover:bg-gray-50 rounded-lg px-4 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/instructor/login">
                  <a className="block py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition font-medium">
                    Log In
                  </a>
                </Link>
                <Link to="/instructor/signup">
                  <a className="block py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 transition font-medium text-center">
                    Sign Up
                  </a>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
