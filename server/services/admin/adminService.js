
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";

//  Get Students
export const getStudentsService = async () => {
  return await User.find({ role: "student", isVerified: true });
};

//  Toggle Student Block
export const toggleStudentBlockService = async studentId => {
  const student = await User.findById(studentId);

  if (!student) throw new Error("Student not found");

  student.isBlocked = !student.isBlocked;
  await student.save();

  return student;
};

//  Get Instructors
export const getInstructorsService = async () => {
  // GET ONLY INSTREU WHO MADE MORE THAN TWO COURSE
  const instructors = await Instructor.find({
    role: "instructor",
    isVerified: true,
  });
  


  return instructors
};

//  Toggle Instructor Block
export const toggleInstructorBlockService = async instructorId => {
  const instructor = await Instructor.findById(instructorId);

  if (!instructor) throw new Error("Instructor not found");

  instructor.isBlocked = !instructor.isBlocked;
  await instructor.save();

  return instructor;
};

//  Student Details
export const getStudentDetailsService = async id => {
  const student = await User.findById(id);
  if (!student) throw new Error("Student not found");

  return student;
};

//  Instructor Details
export const getInstructorDetailsService = async id => {
  const instructor = await Instructor.findById(id);
  if (!instructor) throw new Error("Instructor not found");

  return instructor;
};
