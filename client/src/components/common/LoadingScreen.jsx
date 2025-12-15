import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Change loading text based on progress
    const textInterval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress < 30) {
          setLoadingText("Initializing");
        } else if (currentProgress < 60) {
          setLoadingText("Loading resources");
        } else if (currentProgress < 90) {
          setLoadingText("Almost ready");
        } else {
          setLoadingText("Welcome to Ikigai");
        }
        return currentProgress;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center z-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with rotation and pulse */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 -m-4">
            <div className="w-32 h-32 border-4 border-indigo-200 rounded-full animate-spin-slow"></div>
          </div>

          {/* Middle ring */}
          <div className="absolute inset-0 -m-2">
            <div className="w-28 h-28 border-4 border-purple-200 rounded-full animate-spin-reverse"></div>
          </div>

          {/* Logo */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <img
              src={logo}
              alt="Ikigai Logo"
              className="w-20 h-20 object-contain animate-spin-slow drop-shadow-lg"
            />
          </div>
        </div>

        {/* Brand name with fade-in animation */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
          Ikigai
        </h1>

        {/* Tagline */}
        <p className="text-gray-600 mb-8 animate-fade-in animation-delay-500">
          Find Your Purpose Through Learning
        </p>

        {/* Loading text */}
        <div className="mb-4 h-6">
          <p className="text-sm text-gray-500 animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress percentage */}
        <p className="text-xs text-gray-400 mt-2">{progress}%</p>

        {/* Floating dots */}
        <div className="flex space-x-2 mt-6">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
