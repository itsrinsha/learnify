import Exam from "../models/Exam.js";
import Enrollment from "../models/Enrollment.js";
import ExamAttempt from "../models/ExamAttempt.js";

// Create Exam
export const createExamService = async (examData) => {
  return await Exam.create(examData);
};

// Get Exams for Student (Enrolled courses only)
export const getEnrolledStudentExamsService = async (userId) => {
  // Find courses student is enrolled in
  const enrollments = await Enrollment.find({ user: userId });
  const courseIds = enrollments.map(e => e.course);

  // Find exams for these courses
  const exams = await Exam.find({ course: { $in: courseIds } })
    .populate("course", "title")
    .populate("instructor", "name profileImage");

  // For each exam, get the student's attempt count
  const examsWithAttempts = await Promise.all(exams.map(async (exam) => {
    const attemptCount = await ExamAttempt.countDocuments({ student: userId, exam: exam._id });
    const latestAttempt = await ExamAttempt.findOne({ student: userId, exam: exam._id }).sort({ createdAt: -1 });
    
    return {
      ...exam.toObject(),
      attemptCount,
      latestResult: latestAttempt ? latestAttempt.result : null,
      latestScore: latestAttempt ? latestAttempt.score : null
    };
  }));

  return examsWithAttempts;
};

// Update Exam
export const updateExamService = async (examId, instructorId, updates) => {
  const exam = await Exam.findById(examId);
  if (!exam) throw new Error("Exam not found");
  if (exam.instructor.toString() !== instructorId) throw new Error("Not authorized");

  Object.assign(exam, updates);
  return await exam.save();
};
