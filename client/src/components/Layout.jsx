// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";


function Layout() {
  return (
    <div>
      <Header />
     
        <Outlet />
      
    </div>
  );
}

export default Layout;
