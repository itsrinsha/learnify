import express from "express";
import { markLessonCompleted, getCourseProgress } from "../controllers/progressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/mark-completed", authMiddleware, markLessonCompleted);
router.get("/:courseId", authMiddleware, getCourseProgress);

export default router;
