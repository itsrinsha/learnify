import { 
  getInstructorCoursesService, 
  publishCourseService,
  createCourseDraftService,
  addModuleService,
  addLessonService
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
    const courses = await getInstructorCoursesService(instructorId);
    
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === "published").length;
    
    res.json({
      success: true,
      stats: {
        totalCourses,
        publishedCourses,
        totalStudents: courses.reduce((acc, c) => acc + (c.enrolledStudentsCount || 0), 0),
        totalEarnings: 0, // Placeholder for future payment integration
      },
      courses
    });
});

// ✅ Get instructor courses
export const getInstructorCourses = asyncHandler(async (req, res) => {
    const courses = await getInstructorCoursesService(req.user.id);
    res.json(courses);
});

// ✅ Publish course
export const publishCourse = asyncHandler(async (req, res) => {
    const course = await publishCourseService(req.user.id, req.params.id);
    res.json({ success: true, message: "Course published successfully", course });
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

