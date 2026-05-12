import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getInstructorCourses,
  getInstructorDashboard,
  publishCourse,
  submitVerification,
  createCourseDraft,
  addModule,
  addLesson,
} from "../controllers/instructorController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import approvalMiddleware from "../middleware/approvalMiddleware.js";
import { getReviewHistory } from "../services/instructorService.js";

const router = express.Router();

// ✅ Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorDashboard
);

// ✅ Verification
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("instructor"),
  submitVerification
);

// ✅ Courses
router.get(
  "/courses",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorCourses
);

router.put(
  "/courses/:id/publish",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  publishCourse
);

// ✅ Create Course
router.post(
  "/courses/create",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  createCourseDraft
);

// ✅ Add Module
router.post(
  "/courses/:courseId/modules",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  addModule
);

// ✅ Add Lesson
router.post(
  "/courses/:courseId/modules/:moduleId/lessons",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  addLesson
);
router.get(
  "/review-history",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getReviewHistory
);
export default router;