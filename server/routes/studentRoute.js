import { Router } from "express";
import { getProfile, updateProfile, requestEmailChangeOTP, verifyEmailChangeOTP, changePassword } from "../controllers/students/profileController.js";

const router = Router();

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/request-email-change", requestEmailChangeOTP);
router.post("/profile/verify-email-change", verifyEmailChangeOTP);
router.put("/profile/change-password", changePassword);

export default router;