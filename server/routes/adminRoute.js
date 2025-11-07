import { Router } from 'express'
// import { blockStudent, getStudents, getInstructors, blockInstructor } from '../controllers/admin/adminController.js'
import {getStudents,getInstructors, blockStudent} from '../controllers/admin/adminController.js'
const router = Router()

router.get('/students', getStudents);
router.patch('/students/:studentId/toggle-block', blockStudent)

// INSTRUCTOR CONTROLLER
router.get('/instructors', getInstructors);
// router.patch('/instructors/:instructorId/toggle-block', blockInstructor)
// router.get('/admin/categories', getCategories)
// router.get('/admin/courses', getCourses)
// router.get('/admin/orders', getOrders)
// router.get('/admin/reports', getReports)
// router.get('/admin/settings', getSettings)
// router.get('/admin/profile', getProfile)
// router.get('/admin/logout', logout)

export default router