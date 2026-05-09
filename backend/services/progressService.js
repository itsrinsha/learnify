import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// ✅ Mark Lesson as Completed
export const markLessonCompletedService = async (userId, courseId, lessonId) => {
  // 1. Verify Enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) throw new Error("You are not enrolled in this course");

  // 2. Find or Create Progress record
  let progress = await Progress.findOne({ student: userId, course: courseId });
  if (!progress) {
    progress = await Progress.create({ student: userId, course: courseId, completedLessons: [] });
  }

  // 3. Add lesson if not already present
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  progress.lastAccessed = Date.now();
  await progress.save();

  // 4. Calculate Percentage
  const course = await Course.findById(courseId);
  const totalLessons = course.lessons.length;
  const completedCount = progress.completedLessons.length;
  const percentage = Math.round((completedCount / totalLessons) * 100);

  // 5. Update Enrollment completion status if 100%
  if (percentage === 100) {
    enrollment.completed = true;
    await enrollment.save();
  }

  return { percentage, completedCount, totalLessons };
};

// ✅ Get Course Progress
export const getCourseProgressService = async (userId, courseId) => {
  const progress = await Progress.findOne({ student: userId, course: courseId });
  const course = await Course.findById(courseId);

  if (!course) throw new Error("Course not found");

  const totalLessons = course.lessons.length;
  const completedCount = progress ? progress.completedLessons.length : 0;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    percentage,
    completedLessons: progress ? progress.completedLessons : [],
    totalLessons
  };
};
