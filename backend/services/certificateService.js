import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";
import crypto from "crypto";

// ✅ Generate Certificate Unique ID
const generateUniqueId = (userId, courseId) => {
  const data = `${userId}-${courseId}-${Date.now()}`;
  return `LERN-${crypto.createHash('md5').update(data).digest('hex').toUpperCase().substring(0, 10)}`;
};

// ✅ Check Eligibility and Generate Certificate
export const checkEligibilityAndGenerateService = async (userId, examId) => {
  // 1. Find the exam and course
  const exam = await Exam.findById(examId).populate("course");
  if (!exam) throw new Error("Exam not found");

  const courseId = exam.course._id;

  // 2. Check Enrollment and Progress (Must be 100% completed)
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment || !enrollment.completed) {
    throw new Error("You must complete 100% of the course before receiving a certificate");
  }

  // 3. Check Exam Result (Must have a 'pass' in latest attempt)
  const latestAttempt = await ExamAttempt.findOne({ student: userId, exam: examId }).sort({ createdAt: -1 });
  if (!latestAttempt || latestAttempt.result !== "pass") {
    throw new Error("You must pass the exam to receive a certificate");
  }

  // 4. Prevent Duplicates
  const existingCert = await Certificate.findOne({ student: userId, course: courseId });
  if (existingCert) return existingCert;

  // 5. Generate Certificate Record
  const certificateId = generateUniqueId(userId, courseId);
  const certificate = await Certificate.create({
    student: userId,
    course: courseId,
    instructor: exam.instructor,
    exam: examId,
    certificateId,
    grade: latestAttempt.score >= 90 ? "A+" : latestAttempt.score >= 80 ? "A" : latestAttempt.score >= 70 ? "B" : "C",
  });

  return certificate;
};

// ✅ Get Student Certificates
export const getStudentCertificatesService = async (userId) => {
  return await Certificate.find({ student: userId })
    .populate("course", "title thumbnail")
    .populate("instructor", "name")
    .sort({ issueDate: -1 });
};
