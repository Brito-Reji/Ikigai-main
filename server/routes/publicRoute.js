import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  getPublishedCourses,
  getFeaturedCourses,
  getCourseStats,
  getPublicCourseDetails,
  getPublicCourseChapters,
} from "../controllers/public/courseController.js";

import { getCategories } from "../controllers/admin/catergoryController.js";

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



router.get("/", getCategories);

export default router;
