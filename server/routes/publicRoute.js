import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  getPublishedCourses,
  getFeaturedCourses,
  getCourseStats,
  getPublicCourseDetails,
  getPublicCourseChapters,
  getPublicCourseReviews,
} from "../controllers/public/courseController.js";

import { getCategories } from "../controllers/admin/categoryController.js";
import { getSecureStreamUrl } from "../controllers/instructor/streamController.js";
import getPublicCouponsController from "../controllers/public/publicCoponConroller.js";

const router = Router();

router.get("/courses", authenticate, getPublishedCourses);

router.get("/courses/featured", getFeaturedCourses);
router.get("/courses/stats", getCourseStats);

router.get("/courses/:courseId", authenticate, getPublicCourseDetails);

router.get(
  "/courses/:courseId/chapters",
  authenticate,
  getPublicCourseChapters
);

// public reviews (no auth needed)
router.get("/courses/:courseId/reviews", getPublicCourseReviews);

router.get("/stream-video", getSecureStreamUrl);

router.get("/", getCategories);

// public coupons 
router.get("/coupons", getPublicCouponsController);

export default router;
