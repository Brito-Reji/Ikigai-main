import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/user/LandingPage.jsx";
import UserSignupPage from "./pages/user/SignupPage.jsx";
import Layout from "./components/Layout.jsx";
// import CoursesPage from './pages/CourseListingPage.jsx';
import UserCourseListingPage from "./pages/user/CourseListingPage.jsx";
import UserLoginPage from "./pages/user/LoginPage.jsx";
import UserOTPVerificationPage from "./pages/user/OTPVerificationPage.jsx";
// Instructor Import 
import InstructorLoginPage from './pages/instructor/LoginPage.jsx'
import InstructorSignupPage from './pages/instructor/SignupPage.jsx'

// Admin import
import AdminLoginPage from './pages/admin/LoginPage.jsx'
import AdminDashboard from './pages/admin/AdminDashBoard.jsx'
import AdminLayout from "./pages/admin/AdminLayout";
import Categories from "./pages/admin/Categories";
import Students from "./pages/admin/Students";
import Instructors from "./pages/admin/Instructors";


function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/verify-otp") {
      localStorage.removeItem("otpExpiry");
      console.log("LocalStorage cleared!");
    }
  }, [location.pathname]);
  return (
    <div>
      <Routes>
        <Route path="/" >
          <Route index element={<LandingPage />} />
          <Route path="login" element={<UserLoginPage />} />
          <Route path="signup" element={<UserSignupPage />} />
          <Route path="course" element={<UserCourseListingPage />} />
          <Route path="verify-otp" element={<UserOTPVerificationPage />} />
          {/* <Route path="courses" element={<Courses />} /> */}
          {/* <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} /> */}
        </Route>
        <Route path="/instructor" element={<Layout />}>
          <Route path="login" element={<InstructorLoginPage />} />
          <Route path="signup" element={<InstructorSignupPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          
          <Route index element={<Navigate to="dashboard" replace />} />
          
          
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="category" element={<Categories />} />
          <Route path="students" element={<Students />} />
          <Route path="instructors" element={<Instructors />} />
        
        </Route>
      </Routes>

      {/* <CourseListingPage/> */}
    </div>
  );
}

export default App;
