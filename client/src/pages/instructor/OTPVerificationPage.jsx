import React, { useState, useEffect } from "react";
import { ArrowRight, Mail, Clock, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig.js";

export default function OTPVerificationPage() {
  // For demo purposes - in real app, get from route state
  const location = useLocation();
  const navigate = useNavigate();
  // Get email from navigation state or props
  const [email] = useState(location.state.email); // Replace with actual email from previous page
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  // Initialize timer from localStorage on mount
  useEffect(() => {
    const storedExpiry = localStorage.getItem("otpExpiry");

    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();
      const remainingSeconds = Math.floor((expiryTime - now) / 1000);

      if (remainingSeconds > 0) {
        setOtpTimer(remainingSeconds);
      } else {
        // OTP expired, clean up
        localStorage.removeItem("otpExpiry");
        setOtpTimer(0);
      }
    } else {
      // First time loading, start with 2 minutes
      startNewTimer(120);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0 && !verified) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          const newTime = prev - 1;

          // Update localStorage with new expiry time
          if (newTime > 0) {
            const expiryTime = Date.now() + newTime * 1000;
            localStorage.setItem("otpExpiry", expiryTime.toString());
          } else {
            // Timer expired, clean up
            localStorage.removeItem("otpExpiry");
          }

          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer, verified]);

  // Helper function to start a new timer
  const startNewTimer = (seconds) => {
    const expiryTime = Date.now() + seconds * 1000;
    localStorage.setItem("otpExpiry", expiryTime.toString());
    setOtpTimer(seconds);
  };

  // Format timer display (MM:SS)
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    if (otpTimer === 0) {
      setError("OTP expired. Please request a new one.");
      return;
    }

    setVerifyingOtp(true);
    setError("");

    try {
      // Simulating API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      await api.post('/auth/verify-otp', {
        otp: otpValue,
        email:email
      })

      // Clear timer from localStorage on successful verification
      localStorage.removeItem("otpExpiry");
      setVerified(true);

      setTimeout(() => {
        alert("Email verified! Redirecting to dashboard...");
      }, 1500);
    } catch (error) {
      const errorMessage = error.message || "Failed to verify OTP";
      setError(errorMessage);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendingOtp(true);
    setError("");

    try {
      // Simulating API call
      await api.post('/auth/send-otp',{email});

      // Start new timer (120 seconds)
      startNewTimer(120);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
      alert("OTP resent to your email!");
    } catch (error) {
      console.log(error)
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              {verified ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Mail className="w-8 h-8 text-indigo-600" />
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            {verified ? "Verified!" : "Verify Your Email"}
          </h1>

          <p className="text-gray-600 text-center mb-8">
            {verified
              ? "Your email has been verified successfully"
              : `Enter the 6-digit code sent to ${email}`}
          </p>

          {verified ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  Email verified successfully!
                </span>
              </div>
              <button
                onClick={() => alert("Navigating to dashboard...")}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-2 sm:gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    disabled={verifyingOtp}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="flex items-center justify-center gap-2">
                {otpTimer > 0 ? (
                  <>
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-indigo-600 font-medium">
                      {formatTimer(otpTimer)}
                    </span>
                  </>
                ) : (
                  <span className="text-red-500 text-sm">OTP expired</span>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={verifyingOtp || otp.join("").length !== 6}
                className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition flex items-center justify-center space-x-2 ${
                  verifyingOtp || otp.join("").length !== 6
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                <span>{verifyingOtp ? "Verifying..." : "Verify OTP"}</span>
                {!verifyingOtp && <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={resendingOtp || otpTimer > 0}
                  className={`text-indigo-600 font-medium text-sm ${
                    resendingOtp || otpTimer > 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-indigo-700 hover:underline"
                  }`}
                >
                  {resendingOtp ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => alert("Going back to signup...")}
                  className="text-gray-600 text-sm hover:text-gray-900"
                >
                  Change email address
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Need help?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
