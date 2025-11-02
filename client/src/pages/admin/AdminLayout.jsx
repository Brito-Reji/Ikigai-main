import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Category", path: "/admin/category" },
    { name: "Students", path: "/admin/students" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Instructors", path: "/admin/instructors" },
    { name: "Coupons", path: "/admin/coupons" },
    { name: "Course", path: "/admin/course" },
    { name: "Report", path: "/admin/report" },
    { name: "Logout", path: "/admin/logout" },
  ];

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
