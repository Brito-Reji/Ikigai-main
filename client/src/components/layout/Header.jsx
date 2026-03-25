
import { useState } from "react";
import { Search, Heart, Bell, User, Menu, X, BookOpen, MessageCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useRedux.js";
import { logout } from "@/store/slices/authSlice.js";
import { clearCart } from "@/store/slices/cartSlice.js";
import { useDispatch } from "react-redux";
import logo from "@/assets/images/logo.png";
import CartIcon from "../common/CartIcon.jsx";


export default function Header({ onMenuToggle, menuOpen }) {
  const { isAuthenticated, user } = useAuth();
  // alert(isAuthenticated)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");



  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // clear search and update URL
  const handleClearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    const remaining = params.toString();
    navigate(remaining ? `/courses?${remaining}` : window.location.pathname);
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);
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
            <Link to={isAuthenticated && user?.role === "student" ? "/courses" : "/"}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <img src={logo} className="text-white font-bold text-sm" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Ikigai
                </span>
              </div>
            </Link>

            {/* Desktop Categories Link */}
            <Link
              to="/courses"
              className="hidden md:block text-gray-700 hover:text-gray-900 transition"
            >
              Categories
            </Link>
          </div>

          {/* Center - Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
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
                <Link to="/wishlist">
                  <button className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    <Heart className="w-5 h-5" />
                  </button>
                </Link>
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
                    {user?.role !== "instructor" && user?.role !== "admin" && (
                      <>
                        <Link
                          to="/my-courses"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Courses
                        </Link>
                        <Link
                          to="/chat"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Messages
                        </Link>
                      </>
                    )}
                    <Link
                      to={user?.role === "instructor" ? "/instructor/profile" : "/profile"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                  
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
                {/* Unauthenticated User Actions */}
                <div className="hidden md:block">
                  <CartIcon />
                </div>
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
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                autoFocus
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay - Only on small screens */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-30 overflow-y-auto">
          <nav className="px-4 py-6 space-y-4">
            <Link
              to="/courses"
              onClick={onMenuToggle}
              className="block py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
            >
              Categories
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role !== "instructor" && user?.role !== "admin" && (
                  <>
                    <Link
                      to="/my-courses"
                      onClick={onMenuToggle}
                      className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>My Courses</span>
                    </Link>
                    <Link
                      to="/chat"
                      onClick={onMenuToggle}
                      className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>
                  </>
                )}
                <Link
                  to="/wishlist"
                  onClick={onMenuToggle}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/cart"
                  onClick={onMenuToggle}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <CartIcon />
                  <span>Cart</span>
                </Link>
                <Link
                  to="#"
                  onClick={onMenuToggle}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </Link>
                <Link
                  to={user?.role === "instructor" ? "/instructor/profile" : "/profile"}
                  onClick={onMenuToggle}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.firstName || user?.email || "Profile"}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    onMenuToggle();
                  }}
                  className="block w-full text-left py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  onClick={onMenuToggle}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition"
                >
                  <CartIcon />
                  <span>Cart</span>
                </Link>
                <Link
                  to="/login"
                  onClick={onMenuToggle}
                  className="block py-3 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-4 transition font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={onMenuToggle}
                  className="block py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 transition font-medium text-center"
                >
                  Sign Up
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
