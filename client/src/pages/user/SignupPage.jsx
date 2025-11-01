import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig.js";
import { GoogleLogin } from "@react-oauth/google";
import { ShoppingCart, Search, ArrowRight, Rss } from "lucide-react";
import Header from "@/components/Header.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import Swal from "sweetalert2";
import GoogleAuth from "@/components/GoogleAuth.jsx";
export default function SignUpPage() {
  let navigate = useNavigate();
  // let { setUser, user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "Admin@123",
    confirmPassword: "Admin@123",
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //   await api.post('/auth/student/register',{
  //     email:formData.email,
  //     username:formData.username,
  //     firstName:formData.firstName,
  //  lastName:formData.lastName,
  //  password:formData.password
  //   })
  //   navigate('/verify-otp',{
  //     state:{
  //       email:formData.email
  //     }
  //   })
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, validation starting...");

    if (validateForm()) {
      console.log("Validation passed, making API call...");
      console.log("Form data:", formData);

      try {
        console.log("Making POST request to /auth/student/register");
        const res = await api.post("/auth/student/register", {
          email: formData.email,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        });

        let { accessToken } = res.data
       

        if (res.data.success) {
          console.log("Registration successful, navigating to OTP page");
           localStorage.setItem("token", accessToken);
          navigate("/verify-otp", {
            state: {
              email: formData.email,
            },
          });
        }
      } catch (err) {
        console.error("Registration failed - Full error:", err);
        console.error("Error response:", err.response);

        const errorMessage =
          err.response?.data?.message ||
          "Registration failed. Please try again.";

        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: errorMessage,
        });
      }
    } else {
      console.log("Form validation failed:", errors);
    }
  };

 

  return (
    <div className="min-h-screen bg-white">
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
              <div>
                <a
                  href="#"
                  className="text-gray-900  font-medium text-xs flex justify-center"
                >
                  Already have an account?
                  <a href="" className=" text-blue-500 underline">
                    <Link to={'/login'} >
                    
                  Login
                    </Link>
                  </a>
                </a>
              </div>

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

            <GoogleAuth role={'student'}/>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
