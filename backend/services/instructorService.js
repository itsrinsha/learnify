import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

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
    title: lessonData.title,
    description: lessonData.description,
    videoUrl: lessonData.videoUrl,
    duration: lessonData.duration || "0:00",
    isPreviewFree: lessonData.isPreviewFree || false,
    resources: lessonData.resources || [],
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
  return await Course.find({ instructor: instructorId })
    .populate({
      path: "modules",
      populate: { path: "lessons" }
    })
    .sort({ createdAt: -1 });
};

// ✅ Get Single Course Details for Instructor
export const getCourseDetailsService = async (instructorId, courseId) => {
  const course = await Course.findById(courseId).populate({
    path: "modules",
    populate: { path: "lessons" }
  });

  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  return course;
};

// ✅ Update Course
export const updateCourseService = async (instructorId, courseId, updateData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return updatedCourse;
};

// ✅ Update Lesson
export const updateLessonService = async (instructorId, courseId, lessonId, updateData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  const lesson = await Lesson.findByIdAndUpdate(
    lessonId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!lesson) throw new Error("Lesson not found");
  return lesson;
};

// ✅ Delete Course
export const deleteCourseService = async (instructorId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.instructor.toString() !== instructorId) throw new Error("Not authorized");

  await Course.findByIdAndDelete(courseId);
  // Optionally delete related modules and lessons here
  await Module.deleteMany({ courseId });
  await Lesson.deleteMany({ courseId });

  return { message: "Course deleted successfully" };
};

// ✅ Get Instructor Dashboard Service




export const getInstructorDashboardService = async (instructorId) => {
  // Get all instructor courses
  const courses = await Course.find({
    instructor: instructorId,
  }).sort({ createdAt: -1 });

  const courseIds = courses.map((course) => course._id);

  // Get all enrollments for instructor courses
  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  })
    .populate("user", "name email profileImage")
    .populate("course", "title price discountPrice thumbnail");

  // Total students
  const totalStudents = enrollments.length;

  // Total earnings
  let totalEarnings = 0;
  enrollments.forEach((enrollment) => {
    // Assuming course price is what instructor earned (simplified)
    if (enrollment.course?.price) {
      totalEarnings += enrollment.course.price;
    }
  });

  // Recent courses
  const recentCourses = courses.slice(0, 5);

  // Recent students (unique users)
  const uniqueStudentIds = [...new Set(enrollments.map(e => e.user?._id?.toString()))];
  const totalUniqueStudents = uniqueStudentIds.length;

  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === "published").length,
    totalStudents: totalUniqueStudents,
    enrolledStudents: totalStudents,
    totalEarnings,
    recentCourses,
    courses // include all courses for detail views
  };
};

export const getInstructorStudentsService = async (instructorId) => {
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map(c => c._id);

  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate("user", "name email profileImage")
    .populate("course", "title price");

  return enrollments.map(e => ({
    id: e._id,
    studentId: e.user?._id,
    name: e.user?.name,
    email: e.user?.email,
    avatar: e.user?.profileImage,
    courseId: e.course?._id,
    courseName: e.course?.title,
    purchaseDate: e.createdAt,
    progress: e.progress || 0,
    status: e.completed ? 'Completed' : 'Active'
  }));
};

export const getReviewHistory = async (instructorId) => {
  // Real implementation for backend
  // return await Review.find({ instructor: instructorId }).populate('course student');
  return []; 
};