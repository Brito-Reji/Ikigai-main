import { Router } from "express";
import { getProfile, updateProfile, requestEmailChangeOTP, verifyEmailChangeOTP, changePassword } from "../controllers/profileController.js";
import protect from "../middlewares/protect.js";

const router = Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/request-email-change", protect, requestEmailChangeOTP);
router.post("/verify-email-change", protect, verifyEmailChangeOTP);
router.put("/change-password", protect, changePassword);

export default router;
