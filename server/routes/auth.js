import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'

import { adminLogin } from '../controllers/admin/adminController.js'
import { instructorRegister, instructorSignin } from '../controllers/instructor/instructorController.js'


const router = express.Router()
// Instrucotr Route
router.get('/instructor/register', instructorRegister)
router.get('/instructor/signin',instructorSignin)

router.post('/student/register', studentRegister)

router.post('/admin/login',adminLogin)

export default router