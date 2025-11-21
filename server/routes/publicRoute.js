import { Router } from 'express';
import { getPublishedCourses, getFeaturedCourses, getCourseStats } from '../controllers/public/courseController.js';

const router = Router();

// Public course routes (no authentication required)
router.get('/courses', getPublishedCourses);
router.get('/courses/featured', getFeaturedCourses);
router.get('/courses/stats', getCourseStats);

// Debug route to check all courses (temporary)
router.get('/debug/courses', async (req, res) => {
    try {
        const { Course } = await import('../models/Course.js');
        const allCourses = await Course.find({}).populate('category', 'name').populate('instructor', 'name');
        res.json({
            success: true,
            total: allCourses.length,
            courses: allCourses.map(c => ({
                id: c._id,
                title: c.title,
                published: c.published,
                blocked: c.blocked,
                category: c.category?.name,
                instructor: c.instructor?.name,
                createdAt: c.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;