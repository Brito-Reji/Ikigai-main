import { Router } from "express"
import { getStudents, getInstructors, blockStudent, blockInstructor, getStudentDetails, getInstructorDetails } from "../controllers/admin/adminController.js"
import { getAllCourses, getCourseDetails, toggleCourseBlock, deleteCourse, getCourseStatistics, updateVerificationStatus, getPendingVerifications, getVerificationStatistics, getAdminCourseChapters } from "../controllers/admin/courseController.js"
const router = Router()

router.get("/students", getStudents);
router.get("/students/:id", getStudentDetails)
router.patch("/students/:studentId/toggle-block", blockStudent)

// INSTRUCTOR CONTROLLER
router.get("/instructors", getInstructors);
router.patch("/instructors/:instructorId/toggle-block", blockInstructor)
router.get("/instructors/:id", getInstructorDetails)

// COURSE MANAGEMENT
router.get("/courses", getAllCourses);
router.get("/courses/statistics", getCourseStatistics);
router.get("/courses/:courseId", getCourseDetails);
router.get("/courses/:courseId/chapters", getAdminCourseChapters);
router.patch("/courses/:courseId/toggle-block", toggleCourseBlock);
router.delete("/courses/:courseId", deleteCourse);

// COURSE VERIFICATION
router.patch("/courses/:courseId/verification", updateVerificationStatus);
router.get("/verifications/pending", getPendingVerifications);
router.get("/verifications/statistics", getVerificationStatistics);




export default router