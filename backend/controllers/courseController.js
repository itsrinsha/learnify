import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";

import {
  createCourseService,
  deleteCourseService,
  getCourseByIdService,
  getCoursesService,
  updateCourseService,
} from "../services/courseServices.js";


// ✅ Create Course
export const createCourse = async (req, res) => {

  const course = await createCourseService({
    ...req.body,
    instructor: req.user.id,
  });

  res.status(201).json({
    success: true,
    course,
  });
};


// ✅ Get all courses
export const getCourses = async (req, res) => {

  const courses = await getCoursesService();

  res.status(200).json({
    success: true,
    courses,
  });
};


// ✅ Get single course
export const getCourseById = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const userRole = req.user ? req.user.role : null;

  const course = await getCourseByIdService(req.params.id, userId, userRole);

  res.status(200).json({
    success: true,
    course,
  });
};


// ✅ Update Course
export const updateCourse = async (req, res) => {

  const updated = await updateCourseService({
    courseId: req.params.id,
    userId: req.user.id,
    updates: req.body,
  });

  res.status(200).json({
    success: true,
    updated,
  });
};


// ✅ Delete Course
export const deleteCourse = async (req, res) => {

  await deleteCourseService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
};

export const addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, duration, isPreviewFree } = req.body;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`,
      {
        resource_type: "video",
        folder: "learnify-lectures",
      }
    );

    // Create lecture object
    const lecture = {
      title,
      description,
      duration,
      isPreviewFree,
      videoUrl: result.secure_url,
    };

    // Push lecture into course
    course.lectures.push(lecture);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture added successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


