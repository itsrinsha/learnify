import express from "express";
import { createExam, getStudentExams, updateExam } from "../controllers/examController.js";
import { 
  checkEligibility, 
  submitAttempt, 
  requestExtraAttempt, 
  getAttemptHistory 
} from "../controllers/attemptController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Exam management
router.post("/", authMiddleware, createExam); // Instructor only in practice (add roleMiddleware if needed)
router.get("/student", authMiddleware, getStudentExams);
router.put("/:id", authMiddleware, updateExam);

// Attempt management
router.get("/:examId/eligibility", authMiddleware, checkEligibility);
router.post("/:examId/submit", authMiddleware, submitAttempt);
router.post("/:examId/request", authMiddleware, requestExtraAttempt);
router.get("/:examId/history", authMiddleware, getAttemptHistory);

export default router;
