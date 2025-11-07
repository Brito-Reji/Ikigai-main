import { useState } from "react";  
import { Outlet } from "react-router-dom";
import InstructorHeader from "./InstructorHeader.jsx";

function InstructorLayout() {
  const [menuOpen, setMenuOpen] = useState(false);  
  
  return (
    <div>
      <InstructorHeader 
        menuOpen={menuOpen}  
        onMenuToggle={() => setMenuOpen(!menuOpen)}  
      />
     
      <Outlet />
    </div>
  );
}

export default InstructorLayout;
