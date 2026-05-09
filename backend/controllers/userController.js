import { 
  enrollCourseService, 
  getEnrolledCoursesService, 
  getUserProfileService, 
  updateUserProfileService,
  getInstructorsByStudentService,
  getMyEnrolledLiveSessionsService,
  getMyEnrolledReviewsService
} from "../services/userServices.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const enrollments = await getEnrolledCoursesService(req.user.id);
    const completedCourses = enrollments.filter(item => item.completed === true);
    const pendingCourses = enrollments.filter(item => item.completed !== true);

    res.status(200).json({
      success: true,
      studentName: req.user.name,
      completedCourses: completedCourses.length,
      pendingCourses: pendingCourses.length,
      enrolledCourses: enrollments,
      totalCourses: enrollments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get Profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileService(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ✅ Update Profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfileService(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ✅ Enroll
export const enrollCourse = async (req, res, next) => {
  try {
    const enrollment = await enrollCourseService({
      userId: req.user.id,
      courseId: req.body.courseId,
    });
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

// ✅ Enrolled courses
export const getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await getEnrolledCoursesService(req.user.id);
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

// ✅ Get Instructors for Student
export const getInstructorsByStudent = async (req, res, next) => {
  try {
    const instructors = await getInstructorsByStudentService(req.user.id);
    res.status(200).json(instructors);
  } catch (error) {
    next(error);
  }
};

// ✅ Get My Enrolled Live Sessions
export const getMyEnrolledLiveSessions = async (req, res, next) => {
  try {
    const sessions = await getMyEnrolledLiveSessionsService(req.user.id);
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// ✅ Get My Enrolled Reviews
export const getMyEnrolledReviews = async (req, res, next) => {
  try {
    const reviews = await getMyEnrolledReviewsService(req.user.id);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};