import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";

// ✅ Create Basic Course (Draft)
export const createCourseDraftService = async (instructorId, courseData) => {
  const existingCourse = await Course.findOne({ title: courseData.title });
  if (existingCourse) throw new Error("Course title already exists");

  const course = await Course.create({
    ...courseData,
    instructor: instructorId,
    status: "draft",
  });

  return course;
};

// ✅ Add Module to Course
export const addModuleService = async (instructorId, courseId, moduleData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  const moduleCount = await Module.countDocuments({ courseId });
  const newModule = await Module.create({
    ...moduleData,
    courseId,
    order: moduleCount + 1,
  });

  return newModule;
};

// ✅ Add Lesson to Module
export const addLessonService = async (instructorId, courseId, moduleId, lessonData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  const module = await Module.findById(moduleId);
  if (!module) throw new Error("Module not found");

  const lessonCount = await Lesson.countDocuments({ moduleId });
  const lesson = await Lesson.create({
    ...lessonData,
    courseId,
    moduleId,
    order: lessonCount + 1,
  });

  return lesson;
};

// ✅ Publish Course
export const publishCourseService = async (instructorId, courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "modules",
    populate: { path: "lessons" }
  });

  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  // Validation: Ensure course has content before publishing
  if (!course.thumbnail) throw new Error("Course thumbnail is required before publishing");
  if (!course.modules || course.modules.length === 0) throw new Error("Course must have at least one module before publishing");
  
  const hasLessons = course.modules.some(m => m.lessons && m.lessons.length > 0);
  if (!hasLessons) throw new Error("Each module must have at least one lesson before publishing");

  course.status = "published";
  await course.save();

  return course;
};

// ✅ Get Instructor Courses
export const getInstructorCoursesService = async (instructorId) => {
  return await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });
};

// ✅ Get Instructor Dashboard Service




export const getInstructorDashboardService = async (instructorId) => {

  // Get all instructor courses
  const courses = await Course.find({
    instructor: instructorId,
  }).sort({ createdAt: -1 });

  // Extract course IDs
  const courseIds = courses.map(
    (course) => course._id
  );

  // Get all enrollments for instructor courses
  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  })
    .populate("user", "name email profileImage")
    .populate("course", "title price thumbnail");

  // Total students
  const totalStudents = enrollments.length;

  // Total earnings
  let totalEarnings = 0;

  enrollments.forEach((enrollment) => {

    if (enrollment.course?.price) {

      totalEarnings += enrollment.course.price;
    }
  });

  // Recent courses
  const recentCourses = courses.slice(0, 5);

  // Recent students
  const recentStudents = enrollments.slice(0, 5);

  return {

    totalCourses: courses.length,

    totalStudents,

    enrolledStudents: totalStudents,

    totalEarnings,

    recentCourses,

    recentStudents,
  };
};

export const getReviewHistory = async () => {

  const response = await axiosInstance.get(
    "/instructor/review-history"
  );

  return response.data;
};