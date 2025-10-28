import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Layout from './components/Layout.jsx';
// import CoursesPage from './pages/CourseListingPage.jsx';
import CourseListingPage from './pages/CourseListingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OTPVerificationPage from './pages/OTPVerificationPage.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/course" element={<CourseListingPage />} />
          <Route path='/verify-otp' element={<OTPVerificationPage/>} />
          {/* <Route path="courses" element={<Courses />} /> */}
          {/* <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} /> */}
        </Route>
      </Routes>

      {/* <CourseListingPage/> */}
    </div>
  );
}

export default App