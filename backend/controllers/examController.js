import { 
  createExamService, 
  getEnrolledStudentExamsService, 
  updateExamService 
} from "../services/examService.js";

// ✅ Create Exam
export const createExam = async (req, res, next) => {
  try {
    const exam = await createExamService({
      ...req.body,
      instructor: req.user.id,
    });
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

// ✅ Get Enrolled Student Exams
export const getStudentExams = async (req, res, next) => {
  try {
    const exams = await getEnrolledStudentExamsService(req.user.id);
    res.json(exams);
  } catch (error) {
    next(error);
  }
};

// ✅ Update Exam
export const updateExam = async (req, res, next) => {
  try {
    const exam = await updateExamService(req.params.id, req.user.id, req.body);
    res.json(exam);
  } catch (error) {
    next(error);
  }
};
