import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, CheckCircle, XCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useRedux.js";
import { registerUser, clearError } from "@/store/slices/authSlice.js";
import Swal from "sweetalert2";
import GoogleAuth from "@/components/GoogleAuth.jsx";
import logo from "../../assets/images/logo.png";
import { useUsernameCheck } from "@/hooks/useUsernameCheck.js";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { loading, requiresVerification, verificationEmail, dispatch, isAuthenticated } =
    useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Check username availability
  const { isChecking, isAvailable, message } = useUsernameCheck(formData.username);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated || localStorage.getItem("accessToken")) {
      navigate("/instructor/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle verification requirement
  useEffect(() => {
    if (requiresVerification && verificationEmail) {
      navigate("/instructor/verify-otp", {
        state: {
          email: verificationEmail,
          role: "instructor",
        },
      });
    }
  }, [requiresVerification, verificationEmail, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if username is available
    if (isAvailable === false) {
      Swal.fire({
        icon: "error",
        title: "Username not available",
        text: "Please choose a different username",
      });
      return;
    }

    if (validateForm()) {
      try {
        // Use Redux action to register instructor
        await dispatch(
          registerUser({
            userData: {
              email: formData.email,
              username: formData.username,
              firstName: formData.firstName,
              lastName: formData.lastName,
              password: formData.password,
            },
            role: "instructor",
          })
        ).unwrap();
      } catch (err) {
        console.error("Registration failed:", err);
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: err.message || "Registration failed. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-linear-to-br from-indigo-600 to-purple-700 relative overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
          alt="Instructor teaching"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Start Teaching Today</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Share your expertise with millions of students around the world.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Build your personal brand
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Flexible schedule, work from anywhere
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Get paid for your knowledge
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <img src={logo} alt="Ikigai Logo" className="h-16 w-auto animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ikigai</h2>
            <p className="text-sm text-gray-500 mt-1">Find Your Purpose Through Learning</p>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Become an Instructor
            </h1>
            <p className="text-gray-600">Join our community of expert instructors</p>
          </div>

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
                      disabled={loading}
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
                      disabled={loading}
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
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.username 
                        ? "border-red-500" 
                        : isAvailable === false 
                        ? "border-red-500" 
                        : isAvailable === true 
                        ? "border-green-500" 
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10`}
                    disabled={loading}
                  />
                  {/* Username availability indicator */}
                  {formData.username.length >= 3 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isChecking ? (
                        <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : isAvailable === true ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : isAvailable === false ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
                {!errors.username && formData.username.length >= 3 && message && (
                  <p className={`mt-1 text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                    {message}
                  </p>
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
                  disabled={loading}
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    disabled={loading}
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
                disabled={loading || isAvailable === false || isChecking}
                className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium ${
                  loading || isAvailable === false || isChecking
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                }`}
                >
                <span>
                  {loading ? "Creating Account..." : "Create Account"}
                </span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
              
              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/instructor/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                  Sign in
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
              <GoogleAuth role={"instructor"} />
            </form>
          </div>
      </div>
    </div>
  );
}
