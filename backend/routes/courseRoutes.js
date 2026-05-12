import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";
import upload from "../middleware/upload.js";
import { addLecture } from "../controllers/courseController.js";


const router = express.Router();

// create course
router.post("/", createCourse);

// get all courses
router.get("/", getCourses);

// get single course
router.get("/:id", optionalAuthMiddleware, getCourseById);

// update course
router.put("/:id", updateCourse);

// delete course
router.delete("/:id", deleteCourse);

router.post(
  '/:courseId/add-lecture',
  upload.any("video"),
  addLecture
)

export default router;