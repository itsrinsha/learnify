import express from "express"
import {
  getAllUsers,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getInstructorRequests,
  approveInstructor,
  rejectInstructor,
} from "../controllers/adminController.js";

import roleMiddleware from "../middleware/roleMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// User management
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

// Course management
router.get("/courses", authMiddleware, roleMiddleware("admin"), getAllCoursesAdmin);
router.delete("/courses/:id", authMiddleware, roleMiddleware("admin"), deleteCourseAdmin);

// Instructor verification management
router.get(
  "/instructor-requests",
  authMiddleware,
  roleMiddleware("admin"),
  getInstructorRequests
);

router.patch(
  "/approve-instructor/:id",
  authMiddleware,
  roleMiddleware("admin"),
  approveInstructor
);

router.patch(
  "/reject-instructor/:id",
  authMiddleware,
  roleMiddleware("admin"),
  rejectInstructor
);

export default router;