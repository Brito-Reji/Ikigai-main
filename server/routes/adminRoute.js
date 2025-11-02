import { Router } from 'express'
import { getStudents } from '../controllers/admin/adminController.js'

const router = Router()

router.get('/students', getStudents)
// router.get('/admin/instructors', getInstructors)
// router.get('/admin/categories', getCategories)
// router.get('/admin/courses', getCourses)
// router.get('/admin/orders', getOrders)
// router.get('/admin/reports', getReports)
// router.get('/admin/settings', getSettings)
// router.get('/admin/profile', getProfile)
// router.get('/admin/logout', logout)

export default router