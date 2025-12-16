import { Router } from "express";
import { getProfile, updateProfile, requestEmailChangeOTP, verifyEmailChangeOTP, changePassword } from "../controllers/students/profileController.js";
import { getCart, addToCart, removeFromCart, syncCart, clearCart } from "../controllers/students/cartController.js";
import { getWishlist, toggleWishlist, removeFromWishlist } from "../controllers/students/wishlistController.js";

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

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist/toggle", toggleWishlist);
router.delete("/wishlist/:courseId", removeFromWishlist);

export default router;