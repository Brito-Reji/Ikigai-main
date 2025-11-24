import express from "express";
import {
  googleAuth,
  studentLogin,
  studentRegister,
} from "./controllers/students/studentController.js";
import { adminLogin } from "./controllers/admin/adminController.js";
import {
  instructorGoogleAuth,
  instructorRegister,
  instructorSignin,
} from "./controllers/instructor/instructorController.js";
import { forgetPassword, verifyForgetPasswordOTP, resetPassword } from "./controllers/auth/forgetPassword.js";
import { checkUsernameAvailabilty } from "./controllers/auth/checkUsername.js";
import { currentUser } from "./controllers/auth/currentUser.js";
import { sentOTP, verifyOTP } from "./utils/OTPServices.js";

const router = express.Router();

// Instructor Routes
router.post("/instructor/register", instructorRegister);
router.post("/instructor/signin", instructorSignin);
router.route("/instructor/google").post(instructorGoogleAuth);

// Student
router.post("/student/register", studentRegister);
router.post("/student/login", studentLogin);
router
  .route("/student/google")
  .post(googleAuth)

router.post("/admin/login", adminLogin);

// OTP
router.post("/send-otp", sentOTP);
router.post("/verify-otp", verifyOTP);

// Forget Password
router.post("/forget-password", forgetPassword);
router.post("/verify-forget-password-otp", verifyForgetPasswordOTP);
router.post("/reset-password", resetPassword);

// Check username availability using query params
router.get("/check-username", checkUsernameAvailabilty);

// Refresh token endpoint
router.post("/refresh", );

// Get current user from access token
router.get("/me", currentUser);

export default router;
