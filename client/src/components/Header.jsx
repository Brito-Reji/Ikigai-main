"use client";
import { Search, Heart, ShoppingCart, Bell, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({
  isAuthenticated = false,
  onMenuToggle,
  menuOpen,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Ikigai
              </span>
            </div>

            {/* Desktop Categories Link */}
            <a
              href="#"
              className="hidden sm:block text-gray-700 hover:text-gray-900 transition"
            >
              Categories
            </a>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search courses"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Authenticated User Actions */}
                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button className="hidden sm:flex p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                  <User className="w-5 h-5 text-white" />
                </button>
              </>
            ) : (
              <>
                {/* Unauthenticated User Actions */}
                <Link to={"/login"}>
                  <button className="hidden sm:inline-block px-4 py-2 text-gray-700 hover:text-gray-900 transition font-medium text-sm">
                    Sign In
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
