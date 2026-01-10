import React, { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice.js";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useUser()

  useEffect(() => {
     console.log(user)
      if(!user || user?.role !== "admin") {
    navigate("/")
  }
  },[user, navigate])

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
      dispatch(logout());
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-800">Ikigai</span>
        </div>

        <nav className="py-4">
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
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 mt-4 border-t pt-4"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area - Child routes render here */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
