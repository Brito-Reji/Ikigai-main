// src/components/Layout.jsx
import { useEffect, useState } from "react";  
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import useUser from "@/hooks/useUser.js";
import { useNavigate } from "react-router-dom";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);  
  const navigate = useNavigate()
  let user = useUser()
   useEffect(() => {
        if(!user && user?.role !== "student") {
      navigate("/")
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