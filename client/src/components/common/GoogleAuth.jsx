import { GoogleLogin } from "@react-oauth/google";
import React from "react";
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
