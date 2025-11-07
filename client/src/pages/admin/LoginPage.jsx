import React, { useState } from "react";
import { ShoppingCart, Search, ArrowRight, Eye, EyeOff, Coins } from "lucide-react";
import axios from "axios";
import api from "@/api/axiosConfig.js";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  let navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "Admin@123",
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

  const validateEmail = (email) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email) {
    //   return "Email is required";
    // }
    // if (!emailRegex.test(email)) {
    //   return "Please enter a valid email address";
    // }
    // return "";
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

  const handleSubmit = async () => {
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
      console.log("Login submitted:", formData);
     let response = await api.post('/auth/admin/login', {
        email: formData.email,
        password:formData.password
     })
     console.log("response",response)
     localStorage.setItem('accessToken', response.data.accessToken)
      console.log(response)
      let { data } = response
      console.log(data)
      if(data.success){
        navigate("/admin/dashboard")
      } else {
        toast.error(data.message)
      }
  
    }
  };


  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md ">
          <h1 className=" flex justify-center items-center text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Admin Dashboard
          </h1>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {/* Email */}
              </label>
              <input
                type="email"
                name="email"
                placeholder=" Email ID"
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
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Forgot Password */}


            {/* Divider */}
          

           
          
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
