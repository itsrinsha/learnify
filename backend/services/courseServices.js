import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";

// ================= CREATE COURSE =================
export const createCourseService = async ({
  title,
  description,
  price,
  category,
  instructor,
  thumbnail,
  language,
  level,
}) => {
  const course = await Course.create({
    title,
    description,
    price,
    category,
    instructor,
    thumbnail,
    language,
    level,
  });

  return course;
};

// ================= GET ALL COURSES =================
export const getCoursesService = async () => {
  const courses = await Course.find({
    status: "published",
  })
    .populate("instructor", "name email profileImage")
    .sort({ createdAt: -1 });

  return courses;
};

// ================= GET COURSE BY ID =================
export const getCourseByIdService = async (
  courseId,
  userId = null,
  userRole = null
) => {
  const course = await Course.findById(courseId).populate(
    "instructor",
    "name email profileImage verificationDetails"
  );

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  // Get modules
  const modules = await Module.find({ courseId }).sort({
    order: 1,
  });

  // Get lessons
  const lessons = await Lesson.find({ courseId }).sort({
    order: 1,
  });

  // Attach lessons to modules
  const structuredModules = modules.map((module) => ({
    ...module.toObject(),
    lessons: lessons.filter(
      (lesson) =>
        lesson.moduleId.toString() === module._id.toString()
    ),
  }));

  const courseData = {
    ...course.toObject(),
    modules: structuredModules,
    lessonsCount: lessons.length,
  };

  // ================= STUDENT =================
  if (userRole === "student") {
    const isEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    // If not enrolled → hide paid lessons
    if (!isEnrolled) {
      courseData.modules = courseData.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          _id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          isPreviewFree: lesson.isPreviewFree,
          videoUrl: lesson.isPreviewFree
            ? lesson.videoUrl
            : null,
        })),
      }));

      return {
        ...courseData,
        isEnrolled: false,
      };
    }

    return {
      ...courseData,
      isEnrolled: true,
    };
  }

  // ================= INSTRUCTOR =================
  if (
    userRole === "instructor" &&
    course.instructor._id.toString() === userId
  ) {
    return {
      ...courseData,
      isEnrolled: true,
    };
  }

  // ================= ADMIN =================
  if (userRole === "admin") {
    return {
      ...courseData,
      isEnrolled: true,
    };
  }

  // ================= PUBLIC USER =================
  courseData.modules = courseData.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      _id: lesson._id,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      isPreviewFree: lesson.isPreviewFree,
      videoUrl: lesson.isPreviewFree
        ? lesson.videoUrl
        : null,
    })),
  }));

  return {
    ...courseData,
    isEnrolled: false,
  };
};

// ================= UPDATE COURSE =================
export const updateCourseService = async ({
  courseId,
  userId,
  updates,
}) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  // Ownership check
  if (course.instructor.toString() !== userId) {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(course, updates);

  await course.save();

  return course;
};

// ================= DELETE COURSE =================
export const deleteCourseService = async (
  courseId,
  userId
) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  // Ownership check
  if (course.instructor.toString() !== userId) {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  // Delete related data
  await Module.deleteMany({ courseId });
  await Lesson.deleteMany({ courseId });
  await Enrollment.deleteMany({ course: courseId });

  // Delete course
  await course.deleteOne();

  return true;
};