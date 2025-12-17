import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "@/components/common/AuthGuard.jsx";
import Layout from "@/components/layout/Layout.jsx";
import InstructorLayout from "@/components/layout/InstructorLayout.jsx";
import AdminLayout from "@/pages/admin/AdminLayout";
import NotFound from "@/pages/NotFound.jsx";

// User routes
import LandingPage from "@/pages/user/LandingPage.jsx";
import UserSignupPage from "@/pages/user/SignupPage.jsx";
import UserLoginPage from "@/pages/user/LoginPage.jsx";
import UserOTPVerificationPage from "@/pages/user/OTPVerificationPage.jsx";
import StudentForgetPassword from "@/pages/user/StudentForgetPassword.jsx";
import StudentResetPassword from "@/pages/user/Password.jsx";
import UserCourseListingPage from "@/pages/user/CourseListingPage.jsx";
import UserCourseDetailPage from "@/pages/user/CourseDetailPage.jsx";
import CartPage from "@/pages/user/CartPage.jsx";
import WishlistPage from "@/pages/user/WishlistPage.jsx";
import CheckoutPage from "@/pages/user/CheckoutPage.jsx";
import StudentProfilePage from "@/pages/user/ProfilePage.jsx";
import EditStudentProfilePage from "@/pages/user/EditProfilePage.jsx";
import StudentSettingsPage from "@/pages/user/SettingsPage.jsx";

// Instructor routes
import InstructorLoginPage from "@/pages/instructor/LoginPage.jsx";
import InstructorSignupPage from "@/pages/instructor/SignupPage.jsx";
import InstructorOTPVerificationPage from "@/pages/instructor/OTPVerificationPage.jsx";
import InstructorForgetPassword from "@/pages/instructor/ForgetPassword.jsx";
import InstructorResetPassword from "@/pages/instructor/ResetPassword.jsx";
import InstructorDashboard from "@/pages/instructor/Dashboard.jsx";
import CoursesPage from "@/pages/instructor/CoursesPage.jsx";
import CreateCoursePage from "@/pages/instructor/CreateCoursePage.jsx";
import EditCoursePage from "@/pages/instructor/EditCoursePage.jsx";
import CourseDetailPage from "@/pages/instructor/CourseDetailPage.jsx";
import InstructorProfilePage from "@/pages/instructor/ProfilePage.jsx";
import EditInstructorProfilePage from "@/pages/instructor/EditProfilePage.jsx";
import InstructorSettingsPage from "@/pages/instructor/SettingsPage.jsx";

// Admin routes
import AdminLoginPage from "@/pages/admin/LoginPage.jsx";
import AdminDashboard from "@/pages/admin/AdminDashBoard.jsx";
import Categories from "@/pages/admin/Categories";
import CategoryDetail from "@/pages/admin/CategoryDetail";
import Courses from "@/pages/admin/Courses";
import CourseDetail from "@/pages/admin/CourseDetail";
import Students from "@/pages/admin/Students";
import StudentDetail from "@/pages/admin/StudentDetail";
import Instructors from "@/pages/admin/Instructors";
import InstructorDetail from "@/pages/admin/InstructorDetail";

export default function AppRoutes() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<UserLoginPage />} />
        <Route path="signup" element={<UserSignupPage />} />
        <Route path="verify-otp" element={<UserOTPVerificationPage />} />
        <Route path="student/forget-password" element={<StudentForgetPassword />} />
        <Route path="student/reset-password" element={<StudentResetPassword />} />

        <Route path="courses" element={<UserCourseListingPage />} />
        <Route path="course/:courseId" element={<UserCourseDetailPage />} />
        <Route
          path="cart"
          element={
            <AuthGuard requireAuth={true} roles={["student"]}>
              <CartPage />
            </AuthGuard>
          }
        />
        <Route
          path="wishlist"
          element={
            <AuthGuard requireAuth={true} roles={["student"]}>
              <WishlistPage />
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
        <Route
          path="profile"
          element={
            <AuthGuard requireAuth={true} roles={["student"]}>
              <StudentProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="profile/edit"
          element={
            <AuthGuard requireAuth={true} roles={["student"]}>
              <EditStudentProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="settings"
          element={
            <AuthGuard requireAuth={true} roles={["student"]}>
              <StudentSettingsPage />
            </AuthGuard>
          }
        />
      </Route>

      {/* Instructor Routes */}
      <Route path="/instructor/login" element={<InstructorLoginPage />} />
      <Route path="/instructor/signup" element={<InstructorSignupPage />} />
      <Route path="/instructor" element={<InstructorLayout />}>

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
        <Route
          path="profile"
          element={
            <AuthGuard requireAuth={true} roles={["instructor"]}>
              <InstructorProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="profile/edit"
          element={
            <AuthGuard requireAuth={true} roles={["instructor"]}>
              <EditInstructorProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="settings"
          element={
            <AuthGuard requireAuth={true} roles={["instructor"]}>
              <InstructorSettingsPage />
            </AuthGuard>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>

        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:categoryId" element={<CategoryDetail />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetail />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="instructors/:id" element={<InstructorDetail />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
