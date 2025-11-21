import React, { useEffect, useState } from "react";
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
import StudentForgetPassword from "./pages/user/StudentForgetPassword.jsx";
import StudentResetPassword from "./pages/user/Password.jsx";
import CartPage from "./pages/user/CartPage.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";
// Instructor Import
import InstructorLoginPage from "./pages/instructor/LoginPage.jsx";
import InstructorSignupPage from "./pages/instructor/SignupPage.jsx";
import InstructorOTPVerificationPage from "./pages/instructor/OTPVerificationPage.jsx";
import InstructorForgetPassword from "./pages/instructor/ForgetPassword.jsx";
import InstructorResetPassword from "./pages/instructor/ResetPassword.jsx";
import InstructorDashboard from "./pages/instructor/Dashboard.jsx";
import CoursesPage from "./pages/instructor/CoursesPage.jsx";
import CreateCoursePage from "./pages/instructor/CreateCoursePage.jsx";
import EditCoursePage from "./pages/instructor/EditCoursePage.jsx";
import CourseDetailPage from "./pages/instructor/CourseDetailPage.jsx";
import CommunicationPage from "./pages/instructor/CommunicationPage.jsx";

// Admin import
import AdminLoginPage from "./pages/admin/LoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashBoard.jsx";
import AdminLayout from "./pages/admin/AdminLayout";
import Categories from "./pages/admin/Categories";
import CategoryDetail from "./pages/admin/CategoryDetail";
import Students from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import Instructors from "./pages/admin/Instructors";
import InstructorDetail from "./pages/admin/InstructorDetail";

// Auth Guard
import AuthGuard from "./components/AuthGuard.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import api from "./api/axiosConfig.js";
import { isTokenExpired } from "./utils/tokenUtils.js";

function App() {
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatusOnLoad = async () => {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      
      const tokenExpired = isTokenExpired(accessToken);
      
      if (tokenExpired) {
        console.log("Token expired on load, clearing");
        localStorage.removeItem("accessToken");
        return;
      }
      
      try {
        const userResponse = await api.get("/auth/me");
        
        if (userResponse.data.user?.isBlocked) {
          console.log("User is blocked, logging out");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return;
        }
        
        console.log("User status checked, all good");
      } catch (error) {
        console.log("Error checking user status:", error.message);
        
        if (error.response?.data?.isBlocked) {
          console.log("User is blocked, logging out");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        } else if (error.response?.status === 401) {
          console.log("Invalid token, clearing");
          localStorage.removeItem("accessToken");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatusOnLoad();
  }, []);

  useEffect(() => {
    if (location.pathname !== "/verify-otp") {
      localStorage.removeItem("otpExpiry");
      console.log("LocalStorage cleared!");
    }
  }, [location.pathname]);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Routes>
   
        <Route path="/">
<Route path="login" element={<UserLoginPage />} />
          <Route path="signup" element={<UserSignupPage />} />
        </Route>
        


        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          
          <Route
            path="course"
            element={
              <AuthGuard requireAuth={true} roles={["student"]}>
                <UserCourseListingPage />
              </AuthGuard>
            }
          />
          <Route
            path="cart"
            element={
              <AuthGuard requireAuth={true} roles={["student"]}>
                <CartPage />
              </AuthGuard>
            }
          />
          <Route
            path="checkout"
            element={
              <AuthGuard requireAuth={true} roles={["student"]}>
                <CheckoutPage />
              </AuthGuard>
            }
          />
          <Route path="verify-otp" element={<UserOTPVerificationPage />} />
          <Route path="student/forget-password" element={<StudentForgetPassword />} />
          <Route path="student/reset-password" element={<StudentResetPassword />} />
        </Route>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="login" element={<InstructorLoginPage />} />
          <Route path="signup" element={<InstructorSignupPage />} />
          <Route path="verify-otp" element={<InstructorOTPVerificationPage />} />
          <Route path="forget-password" element={<InstructorForgetPassword />} />
          <Route path="reset-password" element={<InstructorResetPassword />} />
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
            path="courses/create"
            element={
              <AuthGuard requireAuth={true} roles={["instructor"]}>
                <CreateCoursePage />
              </AuthGuard>
            }
          />
          <Route
            path="courses/:courseId/edit"
            element={
              <AuthGuard requireAuth={true} roles={["instructor"]}>
                <EditCoursePage />
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
        
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:categoryId" element={<CategoryDetail />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructors/:id" element={<InstructorDetail />} />
        </Route>
      </Routes>

   
    </div>
  );
}

export default App;
