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
