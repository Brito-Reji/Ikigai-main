
import { useState, useRef, useEffect } from "react";
import { Search, Heart, Bell, User, Menu, X, BookOpen, MessageCircle, CheckCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useRedux.js";
import { logoutStudent } from "@/store/slices/studentAuthSlice.js";
import { clearCart } from "@/store/slices/cartSlice.js";
import { useDispatch } from "react-redux";
import logo from "@/assets/images/logo.png";
import CartIcon from "../common/CartIcon.jsx";
import WishlistIcon from "../common/WishlistIcon.jsx";
import { useGetNotifications, useMarkNotificationRead, useMarkAllRead } from "@/hooks/useReport";

// Notification Bell Dropdown
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { data, isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  const notifications = data?.data || [];
  const unread = notifications.filter((n) => !n.read);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n) => {
    if (!n.read) markRead.mutate(n._id);
  };

  const TYPE_COLORS = {
    course_blocked: "bg-amber-100 text-amber-600",
    course_unblocked: "bg-green-100 text-green-600",
    course_deleted: "bg-red-100 text-red-600",
    report_actioned: "bg-blue-100 text-blue-600",
  };

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className="w-5 h-5" />
        {unread.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">
              Notifications
              {unread.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{unread.length}</span>
              )}
            </span>
            {unread.length > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* list */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    !n.read ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? "bg-indigo-500" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!n.read ? "text-gray-900" : "text-gray-600"} truncate`}>
                        {n.title}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[n.type] || "bg-gray-100 text-gray-500"}`}>
                        {n.type?.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}



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
    dispatch(logoutStudent());
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
                <div className="hidden md:block">
                  <WishlistIcon className="!p-2" />
                </div>
                <div className="hidden md:block">
                  <CartIcon />
                </div>
                <NotificationBell />
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
                <div className="flex items-center w-full rounded-lg hover:bg-gray-50 transition px-4 py-3 cursor-pointer" onClick={() => { onMenuToggle(); document.querySelector('button[aria-label="Wishlist"]')?.click(); }}>
                  <WishlistIcon className="!p-0 mr-3 w-5 h-5 flex-shrink-0 pointer-events-none" />
                  <span className="text-gray-700 pointer-events-none">Wishlist</span>
                </div>
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
