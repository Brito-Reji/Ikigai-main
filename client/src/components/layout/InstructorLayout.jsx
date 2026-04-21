import { use, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import useUser from "@/hooks/useUser.js";
import { Menu } from "lucide-react";

function InstructorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't show sidebar on login/signup pages
  const showSidebar =
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/signup") &&
    !location.pathname.includes("/verify-otp");
  let user = useUser();

  useEffect(() => {
    if (user && user.role !== "instructor") {
      navigate("/");
    }
  }, []);

  if (!showSidebar) {
    return <Outlet />;
  }

  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isMobileOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-semibold text-gray-800">Instructor Panel</span>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default InstructorLayout;
