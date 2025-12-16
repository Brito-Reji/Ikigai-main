import { Router } from "express";
import { getProfile, updateProfile, requestEmailChangeOTP, verifyEmailChangeOTP, changePassword } from "../controllers/students/profileController.js";
import { getCart, addToCart, removeFromCart, syncCart, clearCart } from "../controllers/students/cartController.js";

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
router.delete("/cart/:courseId", removeFromCart);
router.post("/cart/sync", syncCart);
router.delete("/cart", clearCart);

export default router;