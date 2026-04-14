import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/api/adminAxiosConfig.js";
import logo from "@/assets/images/logo.png";
import { queryClient } from "@/lib/queryClient.js";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Students", path: "/admin/students" },
    { name: "Instructors", path: "/admin/instructors" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Coupons", path: "/admin/coupons" },
  
    { name: "Reports", path: "/admin/reports" },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to logout?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#14b8a6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      localStorage.removeItem("adminAccessToken");
      api.post("/auth/logout").catch(() => {});
      queryClient.clear();
      navigate('/admin/login');
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully',
        confirmButtonColor: '#14b8a6',
        timer: 2000
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-white shadow-lg flex-shrink-0 h-screen sticky top-0 flex flex-col">
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Ikigai Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-semibold text-gray-800">Ikigai</span>
        </div>

        <nav className="py-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block w-full text-left px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? "bg-teal-500 text-white border-l-4 border-teal-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button - at bottom */}
        <div className="border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
