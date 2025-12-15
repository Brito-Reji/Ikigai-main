import { Router } from "express";
import { getPublishedCourses, getFeaturedCourses, getCourseStats, getPublicCourseDetails } from "../controllers/public/courseController.js";
import { getCategories } from "../controllers/admin/catergoryController.js";
import { getPublicCourseChapters } from "../controllers/students/studentChapterController.js";

const router = Router();

// Public course routes (no authentication required)
router.get("/courses", getPublishedCourses);
router.get("/courses/featured", getFeaturedCourses);
router.get("/courses/stats", getCourseStats);
router.get("/courses/:courseId", getPublicCourseDetails);
router.get("/courses/:courseId/chapters", getPublicCourseChapters);
router.get("/", getCategories);



export default router;