import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleAuth, fetchCurrentUser } from "@/store/slices/authSlice";
import Swal from "sweetalert2";

function GoogleAuth({ role }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential received:", credentialResponse.credential);

      // Dispatch Redux googleAuth action
      const result = await dispatch(
        googleAuth({
          token: credentialResponse.credential,
          role,
        })
      ).unwrap();

      console.log("Google auth successful:", result);

      // Fetch current user data to populate Redux state
      await dispatch(fetchCurrentUser()).unwrap();

      console.log("User data fetched successfully");

      // Navigate based on role
      if (role === "student") {
        navigate("/courses", { replace: true });
      } else if (role === "instructor") {
        navigate("/instructor/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Google auth error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Google authentication failed",
      });
    }
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Google login failed");
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Google authentication failed. Please try again.",
          });
        }}
      />
    </>
  );
}

export default GoogleAuth;
