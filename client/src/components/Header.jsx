"use client";
import { useState } from "react";
import { Search, Heart, Bell, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Changed import to use Redux hook instead of Context
import { useAuth } from "../hooks/useRedux.js";
import { logout } from "../store/slices/authSlice.js";
import { useDispatch } from "react-redux";
import logo from "../assets/images/logo.png";
import CartIcon from "./CartIcon.jsx";


export default function Header({ onMenuToggle, menuOpen }) {
  // Changed to use Redux hook instead of Context
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  console.log("Header auth state:", { isAuthenticated, user });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            {/* Mobile Menu Button - Only on small screens */}
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8  rounded-full flex items-center justify-center">
              <img src={logo} className="text-white font-bold text-sm"></img>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Ikigai
              </span>
            </div>

            {/* Desktop Categories Link */}
            <a
              href="#"
              className="hidden md:block text-gray-700 hover:text-gray-900 transition"
            >
              Categories
            </a>
          </div>

          {/* Center - Desktop Search Bar */}
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
            {/* Mobile Search Icon - Only on small screens */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle search"
            >
              {showMobileSearch ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Authenticated User Actions - Always visible on desktop */}
                <button className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Heart className="w-5 h-5" />
                </button>
                <div className="hidden md:block">
                  <CartIcon />
                </div>
                <button className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative group">
                  <button className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                    <User className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated User Actions - Always visible on desktop */}
                <Link to={"/login"}>
                  <button className="hidden md:inline-block px-4 py-2 text-gray-700 hover:text-gray-900 transition font-medium text-sm border border-gray-300 rounded-lg">
                    Log In
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Only shows on small screens when toggled */}
        {showMobileSearch && (
          <div className="md:hidden pb-4 pt-2 animate-in slide-in-from-top">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search courses"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay - Only on small screens */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-30 overflow-y-auto">
          <nav className="px-4 py-6 space-y-4">
            <a
              href="#"
              className="block py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
            >
              Categories
            </a>

            {isAuthenticated ? (
              <>
                <a
                  href="#"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </a>
                <Link
                  to="/cart"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <CartIcon />
                  <span>Cart</span>
                </Link>
                <a
                  href="#"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.firstName || user?.email || "Profile"}</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <a className="block py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition font-medium">
                    Log In
                  </a>
                </Link>
                <Link to="/signup">
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

// Demo wrapper
