import { use, useEffect, useState } from "react";  
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./instructor/Sidebar.jsx";
import useUser from "@/hooks/useUser.js";

function InstructorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  // Don't show sidebar on login/signup pages
  const showSidebar = !location.pathname.includes("/login") && 
                      !location.pathname.includes("/signup") &&
    !location.pathname.includes("/verify-otp");
  let user = useUser()

  useEffect(() => {
      if(user && user.role !== "instructor") {
    navigate("/")
  }
  },[])

  
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
