import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { 
  getInstructorCourses, 
  getInstructorDashboard, 
  publishCourse, 
  submitVerification,
  createCourseDraft,
  addModule,
  addLesson
} from "../controllers/instructorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import approvalMiddleware from "../middleware/approvalMiddleware.js";

const router = express.Router();

// ✅ Dashboard (Requires Approval)
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorDashboard
);

// ✅ Verification Submission (DOES NOT require Approval)
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("instructor"),
  submitVerification
);

// ✅ Course Management (Requires Approval)
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

// ✅ Manage Content
router.post(
  "/courses/:courseId/modules",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  addModule
);

router.post(
  "/courses/:courseId/modules/:moduleId/lessons",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  addLesson
);

export default router;