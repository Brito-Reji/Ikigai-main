import { Router } from "express";
import {
  getProfile,
  updateProfile,
  requestEmailChangeOTP,
  verifyEmailChangeOTP,
  changePassword,
} from "../controllers/students/profileController.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  syncCart,
  clearCart,
} from "../controllers/students/cartController.js";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/students/wishlistController.js";
import {
  fullRefund,
  partialRefund,
  refundHistory,
} from "../controllers/students/refundController.js";
import {
  getMyEnrollments,
  markLessonComplete,
  getEnrolledCourseById,
} from "../controllers/students/enrollmentController.js";
import { validateCoupon } from "../controllers/students/couponController.js";
import {
  getWallet,
  getTransactions,
} from "../controllers/students/walletController.js";

const router = Router();

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/request-email-change", requestEmailChangeOTP);
router.post("/profile/verify-email-change", verifyEmailChangeOTP);
router.put("/profile/change-password", changePassword);

// Cart
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.post("/cart/sync", syncCart);
router.delete("/cart/:courseId", removeFromCart);
router.delete("/cart", clearCart);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist/toggle", toggleWishlist);
router.delete("/wishlist/:courseId", removeFromWishlist);

// Refunds
router.post("/refund/full", fullRefund);
router.post("/refund/partial", partialRefund);
router.get("/refund/history", refundHistory);

// Enrollments
router.get("/enrollments", getMyEnrollments);
router.get("/enrollments/:courseId", getEnrolledCourseById);
router.post("/enrollments/complete-lesson", markLessonComplete);

// Coupons
router.get("/coupons/validate/:code", validateCoupon);

// Wallet
router.get("/wallet", getWallet);
router.get("/wallet/transactions", getTransactions);

export default router;
