import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  DollarSign,
  Settings,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

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
      name: "Setting",
      path: "/instructor/settings",
      icon: Settings,
    },
    {
      name: "Communication",
      path: "/instructor/messages",
      icon: MessageSquare,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col">
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
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-2 py-2">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Hi, John</p>
          </div>
          <button className="text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
