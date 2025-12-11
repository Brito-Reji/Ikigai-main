import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  DollarSign,
  Settings,
  ChevronLeft,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useRedux.js";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

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
    {
      name: "Setting",
      path: "/instructor/settings",
      icon: Settings,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 h-screen max-h-screen sticky top-0 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <span className="text-white font-semibold text-lg">Ikigai</span>
        </div>
        <button className="text-slate-400 hover:text-white">
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
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
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
          <Link to="/instructor/profile" className="text-slate-400 hover:text-white">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
