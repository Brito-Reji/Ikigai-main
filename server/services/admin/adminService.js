import { Course } from "../../models/Course.js";
import { Enrollment } from "../../models/Enrollment.js";
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

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
  const instructors = await Instructor.find({
    role: "instructor",
    isVerified: true,
  });

  return instructors;
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
  if (!student) throw new AppError("Student not found", HTTP_STATUS.NOT_FOUND);

  return student;
};

//  Instructor Details
export const getInstructorDetailsService = async id => {
  const instructor = await Instructor.findById(id).lean();
  if (!instructor)
    throw new AppError("Instructor not found", HTTP_STATUS.NOT_FOUND);
  let totalCourse = await Course.countDocuments({ instructor: id });
  let courseinfo = await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courses",
      },
    },
    { $unwind: "$courses" },
    {
      $group: {
        _id: "$courses.instructor",
        count: { $sum: 1 },
      },
    },
  ]);
  let totalStudents = courseinfo.filter(data => data._id.toString() === id)[0]
    .count;

  console.log({ ...instructor, totalStudents, totalCourse });
  return { ...instructor, totalStudents, totalCourse };
};
