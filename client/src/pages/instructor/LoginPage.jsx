import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "@/components/GoogleAuth.jsx";
import { useAuth } from "@/hooks/useRedux.js";
import { loginUser, clearError } from "@/store/slices/authSlice.js";
import Swal from "sweetalert2";
import AuthHeader from "@/components/instructor/AuthHeader.jsx";
import AuthFooter from "@/components/instructor/AuthFooter.jsx";
import Footer from "@/components/Footer";

function LoginPage() {
  let navigate = useNavigate()
  const { loading, error, requiresVerification, verificationEmail, dispatch, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    if (touched[name]) {
      if (name === "email") {
        setErrors({
          ...errors,
          email: validateEmail(value),
        });
      } else if (name === "password") {
        setErrors({
          ...errors,
          password: validatePassword(value),
        });
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate on blur
    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(formData.email),
      });
    } else if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(formData.password),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    // Only submit if no errors
    if (!emailError && !passwordError) {
      try {
        await dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
            role: "instructor",
          })
        ).unwrap();
        // Success - will be redirected by useEffect
      } catch (err) {
        console.error("Login failed:", err);
        
        // Clear any existing tokens to prevent stale authentication
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userAuth");
        
        if (!err.requiresVerification) {
          // Check if user is blocked
          if (err.isBlocked || err.message?.toLowerCase().includes("blocked")) {
            Swal.fire({
              icon: "error",
              title: "Account Blocked",
              html: `
                <p>Your account has been blocked.</p>
                <p class="mt-2 text-sm text-gray-600">Please contact support for assistance.</p>
              `,
              confirmButtonColor: "#dc2626",
              confirmButtonText: "OK",
              customClass: {
                popup: "rounded-lg",
                title: "text-red-600",
              }
            });
          } else if (err.message?.toLowerCase().includes("google")) {
            // Special handling for Google auth error
            Swal.fire({
              icon: "info",
              title: "Google Account Detected",
              text: "This account was created with Google. Please use the 'Sign in with Google' button below.",
              confirmButtonColor: "#4285f4",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Login failed",
              text: err.message || "Login failed. Please try again.",
            });
          }
        }
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Sign in with Google");
  };
  return (
    <>
      <AuthHeader showSignupLink={true} />
      <div className="min-h-[calc(100vh-128px)] flex flex-col lg:flex-row bg-white">
      {/* Left Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Instructor Login
            </h1>
            <p className="text-gray-600">Welcome back! Please login to your account.</p>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {/* Email */}
              </label>
              <input
                type="email"
                name="email"
                placeholder="Username or Email ID"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border ${
                  errors.email && touched.email
                  ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } rounded-lg focus:outline-none focus:ring-2`}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {/* Password */}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border ${
                    errors.password && touched.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  } rounded-lg focus:outline-none focus:ring-2 pr-12`}
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
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 shadow-lg hover:shadow-xl"
              }`}
            >
              <span>{loading ? "Signing In..." : "Sign In"}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            {/* Forgot Password & Sign Up Link */}
            <div className="flex items-center justify-between text-sm">
              <a
                href="/instructor/forget-password"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                Forgot password?
              </a>
              <div className="text-gray-600">
                New instructor?{" "}
                <a
                  href="/instructor/signup"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign up
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Sign in with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
          <GoogleAuth role={"instructor"} />
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-linear-to-br from-indigo-600 to-purple-700 relative overflow-hidden lg:min-h-screen order-1 lg:order-2">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
          alt="Instructor teaching"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
        <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Teach What You Love</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of instructors sharing their knowledge and earning income.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Create and manage courses easily
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Reach students worldwide
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Earn money doing what you love
            </li>
          </ul>
        </div>
      </div>
      </div>
      <AuthFooter />
    </>
  );
}

export default LoginPage;
