import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleAuth from "@/components/GoogleAuth.jsx";
import { useAuth } from "@/hooks/useRedux.js";
import { loginUser, clearError } from "@/store/slices/authSlice.js";
import logo from "../../assets/images/logo.png";
import Swal from "sweetalert2";

function LoginPage() {
  let navigate = useNavigate();
  const location = useLocation();
  const { dispatch, loading, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated || localStorage.getItem("accessToken")) {
      navigate("/courses", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Pre-fill email if coming from OTP verification
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email,
      }));
    }
  }, [location.state]);

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "Admin@123",
  });
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

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

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors({
        ...errors,
        general: "",
      });
    }

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
      general: "",
    });

    // Only submit if no errors
    if (!emailError && !passwordError) {
      try {
        const resultAction = await dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
            role: "student",
          })
        );

        console.log("Login result:", resultAction);

        if (loginUser.fulfilled.match(resultAction)) {
          console.log("Login successful, redirecting to course page");
          // Check if user needs OTP verification
          if (resultAction.payload?.requiresVerification) {
            navigate("/verify-otp", {
              state: {
                email: formData.email,
              },
            });
          } else {
            // Clear success message
            setSuccessMessage("");
            // Small delay to ensure Redux state is fully updated
            // Use replace: true to prevent going back to login page
            setTimeout(() => {
              navigate("/courses", { replace: true });
            }, 100);
          }
        } else if (loginUser.rejected.match(resultAction)) {
          // Handle login error
          console.log("Login failed:", resultAction.payload);
          
          // Clear any existing tokens to prevent stale authentication
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userAuth");
          
          // Check if user is blocked
          if (resultAction.payload?.isBlocked || resultAction.payload?.message?.toLowerCase().includes("blocked")) {
            Swal.fire({
              icon: "error",
              title: "Account Blocked",
              text: "Your account has been blocked. Please contact support for assistance.",
              confirmButtonColor: "#dc2626",
              confirmButtonText: "OK",
            });
          } else if (resultAction.payload?.message?.toLowerCase().includes("google")) {
            // Special handling for Google auth error
            Swal.fire({
              icon: "info",
              title: "Google Account Detected",
              text: "This account was created with Google. Please use the 'Sign in with Google' button below.",
              confirmButtonColor: "#4285f4",
              confirmButtonText: "OK",
            });
          } else {
            setErrors({
              ...errors,
              general:
                resultAction.payload?.message ||
                "Login failed. Please try again.",
            });
          }
        }
      } catch {
        setErrors({
          ...errors,
          general: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
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
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue your learning journey</p>
          </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
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
                  Password
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
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              {/* Forgot Password */}
              <div className="text-left flex justify-between">
                <Link
                  to="/student/forget-password"
                  className="text-gray-900 hover:text-gray-700 font-medium"
                >
                  forgot password?
                </Link>
              </div>
              <div>
                <span className="text-gray-900 font-medium text-xs flex justify-center">
                  Don't have an account?
                  <span className="text-blue-500 underline ml-1">
                    <Link to={"/signup"}>Sign up</Link>
                  </span>
                </span>
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
              <GoogleAuth role={"student"} />
            </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-100 relative overflow-hidden lg:min-h-screen order-1 lg:order-2">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
          alt="Student reading in classroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default LoginPage;
