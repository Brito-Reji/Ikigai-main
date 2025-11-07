import { useState } from "react";  
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./instructor/Sidebar.jsx";

function InstructorLayout() {
  const location = useLocation();
  
  // Don't show sidebar on login/signup pages
  const showSidebar = !location.pathname.includes("/login") && 
                      !location.pathname.includes("/signup") &&
                      !location.pathname.includes("/verify-otp");
  
  if (!showSidebar) {
    return <Outlet />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default InstructorLayout;
