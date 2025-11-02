import React, { useState } from "react";
import { Search, Heart, ShoppingCart, Bell, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUI, useCourses } from "../hooks/useRedux.js";
import { logout } from "../store/slices/authSlice.js";
import { toggleMobileMenu } from "../store/slices/uiSlice.js";

export default function HeaderRedux() {
  const navigate = useNavigate();
  const { isAuthenticated, user, dispatch: authDispatch } = useAuth();
  const { mobileMenuOpen, dispatch: uiDispatch } = useUI();
  const { cart, wishlist } = useCourses();
  
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    authDispatch(logout());
    navigate('/');
    setShowUserMenu(false);
  };

  const toggleMobileMenuHandler = () => {
    uiDispatch(toggleMobileMenu());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                LearnHub
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
                  <Heart className="w-6 h-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button 
                  onClick={() => navigate('/cart')}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Courses
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 text-gray-600 hover:text-gray-900 transition"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={toggleMobileMenuHandler}
              className="p-2 text-gray-600 hover:text-gray-900 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <User className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{user?.firstName || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <hr />
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleMobileMenuHandler}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-courses"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleMobileMenuHandler}
                  >
                    My Courses
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleMobileMenuHandler}
                  >
                    <span>Cart</span>
                    {cart.length > 0 && (
                      <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleMobileMenuHandler}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 bg-indigo-600 text-white rounded-lg mx-4 text-center hover:bg-indigo-700 transition"
                    onClick={toggleMobileMenuHandler}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}