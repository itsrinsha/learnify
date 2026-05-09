import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";
import AttemptRequest from "../models/AttemptRequest.js";
import Enrollment from "../models/Enrollment.js";

// Check Eligibility
export const checkAttemptEligibilityService = async (userId, examId) => {
  const exam = await Exam.findById(examId);
  if (!exam) throw new Error("Exam not found");

  // Check enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: exam.course });
  if (!enrollment) throw new Error("You are not enrolled in this course");

  // Check if course is completed (optional business rule)
  // if (!enrollment.completed) throw new Error("You must complete the course before taking the exam");

  const attemptCount = await ExamAttempt.countDocuments({ student: userId, exam: examId });

  // Check if student has remaining attempts
  if (attemptCount < exam.maxAttempts) {
    return { eligible: true, attemptsUsed: attemptCount, maxAttempts: exam.maxAttempts };
  }

  // If no attempts left, check if there's an approved and paid request
  const approvedRequest = await AttemptRequest.findOne({
    student: userId,
    exam: examId,
    status: "approved",
    paymentStatus: { $in: ["paid", "not_applicable"] }
  });

  if (approvedRequest) {
    return { eligible: true, attemptsUsed: attemptCount, maxAttempts: exam.maxAttempts + 1, isExtra: true };
  }

  return { eligible: false, attemptsUsed: attemptCount, maxAttempts: exam.maxAttempts };
};

// Submit Attempt
export const submitAttemptService = async (userId, examId, score) => {
  const eligibility = await checkAttemptEligibilityService(userId, examId);
  if (!eligibility.eligible) throw new Error("You are not eligible for another attempt");

  const exam = await Exam.findById(examId);
  const result = score >= exam.passingMarks ? "pass" : "fail";

  const attempt = await ExamAttempt.create({
    student: userId,
    exam: examId,
    course: exam.course,
    attemptNumber: eligibility.attemptsUsed + 1,
    score,
    result
  });

  // If this was an extra attempt from a request, mark the request as used (or handled)
  if (eligibility.isExtra) {
    await AttemptRequest.findOneAndUpdate(
      { student: userId, exam: examId, status: "approved" },
      { status: "completed" } // Custom status to mark used
    );
  }

  return attempt;
};

// Request Extra Attempt
export const createAttemptRequestService = async (userId, examId, reason) => {
  const existingRequest = await AttemptRequest.findOne({ student: userId, exam: examId, status: "pending" });
  if (existingRequest) throw new Error("You already have a pending request");

  return await AttemptRequest.create({
    student: userId,
    exam: examId,
    requestReason: reason
  });
};

// Get Attempt History
export const getAttemptHistoryService = async (userId, examId) => {
  return await ExamAttempt.find({ student: userId, exam: examId }).sort({ attemptNumber: 1 });
};
