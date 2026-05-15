import { 
  getInstructorCoursesService, 
  publishCourseService,
  createCourseDraftService,
  addModuleService,
  addLessonService,
  getCourseDetailsService,
  updateCourseService,
  updateLessonService,
  deleteCourseService,
  getInstructorDashboardService,
  getInstructorStudentsService
} from "../services/instructorService.js";
import { updateUserProfileService } from "../services/userServices.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";

// ✅ Create Course Draft
export const createCourseDraft = asyncHandler(async (req, res) => {
  const course = await createCourseDraftService(req.user.id, req.body);
  res.status(201).json({ success: true, course });
});

// ✅ Add Module
export const addModule = asyncHandler(async (req, res) => {
  const module = await addModuleService(req.user.id, req.params.courseId, req.body);
  res.status(201).json({ success: true, module });
});

// ✅ Add Lesson
export const addLesson = asyncHandler(async (req, res) => {
  const { courseId, moduleId } = req.params;
  const lesson = await addLessonService(req.user.id, courseId, moduleId, req.body);
  res.status(201).json({ success: true, lesson });
});

// ✅ Get instructor dashboard stats
export const getInstructorDashboard = asyncHandler(async (req, res) => {
    const instructorId = req.user.id;
    const dashboardData = await getInstructorDashboardService(instructorId);
    
    res.json({
      success: true,
      ...dashboardData
    });
});

// ✅ Get instructor students
export const getInstructorStudents = asyncHandler(async (req, res) => {
    const students = await getInstructorStudentsService(req.user.id);
    res.json({ success: true, students });
});

// ✅ Get instructor courses
export const getInstructorCourses = asyncHandler(async (req, res) => {
    const courses = await getInstructorCoursesService(req.user.id);
    res.json(courses);
});

// ✅ Get single course details
export const getCourseDetails = asyncHandler(async (req, res) => {
    const course = await getCourseDetailsService(req.user.id, req.params.id);
    res.json({ success: true, course });
});

// ✅ Update course details
export const updateCourse = asyncHandler(async (req, res) => {
    const course = await updateCourseService(req.user.id, req.params.id, req.body);
    res.json({ success: true, message: "Course updated successfully", course });
});

// ✅ Update lesson details
export const updateLesson = asyncHandler(async (req, res) => {
    const lesson = await updateLessonService(req.user.id, req.params.courseId, req.params.lessonId, req.body);
    res.json({ success: true, message: "Lesson updated successfully", lesson });
});

// ✅ Publish course
export const publishCourse = asyncHandler(async (req, res) => {
    const course = await publishCourseService(req.user.id, req.params.id);
    res.json({ success: true, message: "Course published successfully", course });
});

// ✅ Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
    await deleteCourseService(req.user.id, req.params.id);
    res.json({ success: true, message: "Course deleted successfully" });
});

// ✅ Submit Verification Details
export const submitVerification = asyncHandler(async (req, res) => {
    const { 
      name, age, education, college, degree, graduationYear,
      experience, expertise, certifications, bio, phone, location 
    } = req.body;

    const updateData = {
      name, phone, bio, location,
      approvalStatus: "pending",
      verificationDetails: {
        age, education, college, degree, graduationYear,
        experience, expertise, certifications,
      }
    };

    const user = await updateUserProfileService(req.user.id, updateData);
    res.json({ success: true, message: "Verification details submitted successfully", user });
});

export const getReviewHistory = async (req, res) => {
  try {

    const history = await Review.find({
      instructor: req.user._id,
    })
      .populate("student", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

