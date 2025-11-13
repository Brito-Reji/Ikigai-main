import { Router } from 'express'
// import { blockStudent, getStudents, getInstructors, blockInstructor } from '../controllers/admin/adminController.js'
import {getStudents,getInstructors, blockStudent, blockInstructor, getStudentDetails, getInstructorDetails} from '../controllers/admin/adminController.js'
const router = Router()

router.get('/students', getStudents);
router.get('/students/:id',getStudentDetails)
router.patch('/students/:studentId/toggle-block', blockStudent)

// INSTRUCTOR CONTROLLER
router.get('/instructors', getInstructors);
router.patch('/instructors/:instructorId/toggle-block', blockInstructor)
router.get('/instructors/:id', getInstructorDetails)



export default router