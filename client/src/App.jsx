import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/user/LandingPage.jsx";
import UserSignupPage from "./pages/user/SignupPage.jsx";
import Layout from "./components/Layout.jsx";
import InstructorLayout from "./components/InstructorLayout.jsx";
// import CoursesPage from './pages/CourseListingPage.jsx';
import UserCourseListingPage from "./pages/user/CourseListingPage.jsx";
import UserLoginPage from "./pages/user/LoginPage.jsx";
import UserOTPVerificationPage from "./pages/user/OTPVerificationPage.jsx";
// Instructor Import
import InstructorLoginPage from "./pages/instructor/LoginPage.jsx";
import InstructorSignupPage from "./pages/instructor/SignupPage.jsx";
import InstructorOTPVerificationPage from "./pages/instructor/OTPVerificationPage.jsx";
import InstructorDashboard from "./pages/instructor/Dashboard.jsx";
import CoursesPage from "./pages/instructor/CoursesPage.jsx";
import CourseDetailPage from "./pages/instructor/CourseDetailPage.jsx";
import CommunicationPage from "./pages/instructor/CommunicationPage.jsx";

// Admin import
import AdminLoginPage from "./pages/admin/LoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashBoard.jsx";
import AdminLayout from "./pages/admin/AdminLayout";
import Categories from "./pages/admin/Categories";
import Students from "./pages/admin/Students";
import Instructors from "./pages/admin/Instructors";

// Auth Guard
import AuthGuard from "./components/AuthGuard.jsx";
import { useDispatch } from "react-redux";
import api from "./api/axiosConfig.js";
import { isTokenExpired } from "./utils/tokenUtils.js";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  // Refresh token and check user status on app load
  useEffect(() => {
    const refreshTokenOnLoad = async () => {
      const accessToken = localStorage.getItem("accessToken");
      
      if (accessToken) {
        try {
          // Always check user status on page load to catch blocked users
          const userResponse = await api.get("/auth/me");
          
          if (userResponse.data.user?.isBlocked) {
            console.log("User is blocked, logging out");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            return;
          }
          
          // Check if token is expired or about to expire
          if (isTokenExpired(accessToken)) {
            console.log("Token expired or expiring soon, refreshing...");
            const response = await api.post("/auth/refresh");
            if (response.data.success && response.data.accessToken) {
              localStorage.setItem("accessToken", response.data.accessToken);
              console.log("Token refreshed successfully on page load");
            }
          } else {
            console.log("Token is still valid, no refresh needed");
          }
        } catch (error) {
          console.log("Error on load:", error.message);
          
          // If user is blocked, logout immediately
          if (error.response?.data?.isBlocked) {
            console.log("User is blocked, logging out");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }
        }
      }
    };

    refreshTokenOnLoad();
  }, []);

  useEffect(() => {
    if (location.pathname !== "/verify-otp") {
      localStorage.removeItem("otpExpiry");
      console.log("LocalStorage cleared!");
    }
  }, [location.pathname]);
  return (
    <div>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<UserLoginPage />} />
          <Route path="signup" element={<UserSignupPage />} />
          <Route
            path="course"
            element={
              <AuthGuard requireAuth={true} roles={["student"]}>
                <UserCourseListingPage />
              </AuthGuard>
            }
          />
          <Route path="verify-otp" element={<UserOTPVerificationPage />} />
        </Route>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="login" element={<InstructorLoginPage />} />
          <Route path="signup" element={<InstructorSignupPage />} />
          <Route path="verify-otp" element={<InstructorOTPVerificationPage />} />
          <Route
            path="dashboard"
            element={
              <AuthGuard requireAuth={true} roles={["instructor"]}>
                <InstructorDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="courses"
            element={
              <AuthGuard requireAuth={true} roles={["instructor"]}>
                <CoursesPage />
              </AuthGuard>
            }
          />
          <Route
            path="courses/:courseId"
            element={
              <AuthGuard requireAuth={true} roles={["instructor"]}>
                <CourseDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="communication"
            element={
              <AuthGuard requireAuth={true} roles={["instructor"]}>
                <CommunicationPage />
              </AuthGuard>
            }
          />
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
