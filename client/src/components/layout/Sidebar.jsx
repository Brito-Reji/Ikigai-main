import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  DollarSign,
  Settings,
  ChevronLeft,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useInstructorAuth } from "@/hooks/useRedux.js";
import { logoutInstructor } from "@/store/slices/instructorAuthSlice.js";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import logo from "@/assets/images/logo.png";
import { queryClient } from "@/lib/queryClient.js";

export default function Sidebar({ isMobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useInstructorAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      if (onClose) onClose();
      dispatch(logoutInstructor());
      queryClient.clear();
      navigate("/instructor/login");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/instructor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/instructor/courses",
      icon: BookOpen,
    },
    {
      name: "Communication",
      path: "/instructor/communication",
      icon: MessageSquare,
    },
    {
      name: "Revenue",
      path: "/instructor/revenue",
      icon: DollarSign,
    },
    {
      name: "Profile",
      path: "/instructor/profile",
      icon: User,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-slate-900 h-screen max-h-screen flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="Ikigai Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-semibold text-lg">Ikigai</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
        <button className="text-slate-400 hover:text-white hidden lg:block">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-2 py-2">
          <img
            src={user?.profileImageUrl || "https://i.pravatar.cc/150?img=12"}
            alt={user?.firstName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-white text-sm font-medium">
              Hi, {user?.firstName || "Instructor"}
            </p>
          </div>
          <Link
            to="/instructor/profile"
            onClick={() => onClose && onClose()}
            className="text-slate-400 hover:text-white"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
