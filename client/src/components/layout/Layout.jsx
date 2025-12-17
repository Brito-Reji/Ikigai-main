// src/components/Layout.jsx
import { useEffect, useState } from "react";  
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import useUser from "@/hooks/useUser.js";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);  
  let user = useUser()
   useEffect(() => {
        if(user && user?.role !== "student") {
         alert("You are not authorized to access this page")
    }
    },[])
  
  return (
    <div>
      <Header 
        menuOpen={menuOpen}  
        onMenuToggle={() => setMenuOpen(!menuOpen)}  
      />
     
      <Outlet />
    </div>
  );
}

export default Layout;