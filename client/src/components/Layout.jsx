// src/components/Layout.jsx
import { useState } from "react";  
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);  
  
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