import React, { useState } from "react";
import axios from 'axios'
import { ShoppingCart, Search, ArrowRight } from "lucide-react";
import Header from "@/components/Header.jsx";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for the field being edited
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
     axios.post("http://localhost:3000/api/auth/student/register",);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-100 relative overflow-hidden lg:min-h-screen">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
            alt="Student studying with laptop"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Create Your Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Sign up with
                  </span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                onClick={handleGoogleSignUp}
                type="button"
                className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Google</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
