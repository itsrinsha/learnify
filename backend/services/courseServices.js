import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";



// create
export const createCourseService = async ({ title, description, price, category, instructor }) => {
  const course = await Course.create({
    title,
    description,
    price,
    category,
    instructor,
  });

  return course;
};

// get all published
export const getCoursesService = async () => {
  return await Course.find()
    .populate("instructor", "name email");
};

// get by id
export const getCourseByIdService = async (courseId, userId = null, userRole = null) => {
  const course = await Course.findById(courseId)
    .populate("instructor", "name email profileImage");

  if (!course) {
    throw new Error("Course not found");
  }

  // If user is a student, check enrollment
  if (userRole === "student") {
    const isEnrolled = await Enrollment.findOne({ user: userId, course: courseId });
    if (!isEnrolled) {
      // If not enrolled, return course info but hide lessons/sensitive content
      const courseObj = course.toObject();
      delete courseObj.lessons; 
      return { ...courseObj, isEnrolled: false };
    }
    return { ...course.toObject(), isEnrolled: true };
  }

  // If user is the instructor of this course, they can see everything
  if (userRole === "instructor" && course.instructor._id.toString() === userId) {
    return { ...course.toObject(), isEnrolled: true };
  }

  // If user is admin, they can see everything
  if (userRole === "admin") {
    return { ...course.toObject(), isEnrolled: true };
  }

  // Default: Return public info only
  const publicCourse = course.toObject();
  delete publicCourse.lessons;
  return { ...publicCourse, isEnrolled: false };
};

// update
export const updateCourseService = async ({ courseId, userId, updates }) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  // ownership check
  if (course.instructor.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  Object.assign(course, updates);

  return await course.save();
};

// delete
export const deleteCourseService = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  await course.deleteOne();

  return true;
};