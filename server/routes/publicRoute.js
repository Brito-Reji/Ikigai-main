import { Router } from 'express';
import { getPublishedCourses, getFeaturedCourses, getCourseStats } from '../controllers/public/courseController.js';

const router = Router();

// Public course routes (no authentication required)
router.get('/courses', getPublishedCourses);
router.get('/courses/featured', getFeaturedCourses);
router.get('/courses/stats', getCourseStats);



export default router;