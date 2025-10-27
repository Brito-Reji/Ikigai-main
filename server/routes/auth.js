import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'

import { adminLogin } from '../controllers/admin/adminController.js'
import { instructorRegister, instructorSignin } from '../controllers/instructor/instructorController.js'
import { getMe } from '../middlewares/auth.js'


const router = express.Router()
// Instrucotr Route
router.post('/instructor/register', instructorRegister)
router.post('/instructor/signin',instructorSignin)

router.post('/student/register', studentRegister)

router.post('/admin/login', adminLogin)


// get me

router.get('/me', getMe)

export default router