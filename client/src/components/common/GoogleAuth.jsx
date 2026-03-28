import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { googleStudentAuth, fetchCurrentStudent } from "@/store/slices/studentAuthSlice";
import { googleInstructorAuth, fetchCurrentInstructor } from "@/store/slices/instructorAuthSlice";
import { clearCart } from "@/store/slices/cartSlice";
import Swal from "sweetalert2";

function GoogleAuth({ role }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const authAction = role === "instructor" ? googleInstructorAuth : googleStudentAuth;
      const fetchAction = role === "instructor" ? fetchCurrentInstructor : fetchCurrentStudent;

      await dispatch(authAction({ token: credentialResponse.credential })).unwrap();
      await dispatch(fetchAction()).unwrap();

      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: ["cart"] });

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
    <div style={{ position: "relative", width: "100%", height: "44px" }}>

      {/* Your fully custom visible button — pointer-events none so clicks pass through */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          backgroundColor: "#fff",
          border: "1px solid #dadce0",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Google Sans, Roboto, sans-serif",
          color: "#3c4043",
          cursor: "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </div>

      {/* Google's real button — invisible but sits on top to receive clicks */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          opacity: 0,
          overflow: "hidden",
        }}
      >
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
          size="large"
          shape="rectangular"
          theme="outline"
        />
      </div>

    </div>
  );
}

export default GoogleAuth;