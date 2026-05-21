import axiosInstance from '../features/axiosInstance';

export const getStudentExams = async () => {
  try {
    const response = await axiosInstance.get('/exams/student');
    return response.data;
  } catch (error) {
    console.error('Error fetching student exams:', error);
    throw error;
  }
};

export const getExamHistory = async (examId) => {
  try {
    const response = await axiosInstance.get(`/exams/${examId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching exam history:', error);
    throw error;
  }
};

export const submitExamAttempt = async (examId, score) => {
  try {
    const response = await axiosInstance.post(`/exams/${examId}/submit`, { score });
    return response.data;
  } catch (error) {
    console.error('Error submitting exam attempt:', error);
    throw error;
  }
};

export const requestExtraAttempt = async (examId, reason) => {
  try {
    const response = await axiosInstance.post(`/exams/${examId}/request`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error requesting extra attempt:', error);
    throw error;
  }
};

export const checkExamEligibility = async (examId) => {
  try {
    const response = await axiosInstance.get(`/exams/${examId}/eligibility`);
    return response.data;
  } catch (error) {
    console.error('Error checking exam eligibility:', error);
    throw error;
  }
};

export const getInstructorExams = async () => {
  try {
    const response = await axiosInstance.get('/exams/instructor');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor exams:', error);
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    const response = await axiosInstance.post('/exams', examData);
    return response.data;
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
};

export const updateExam = async (examId, examData) => {
  try {
    const response = await axiosInstance.put(`/exams/${examId}`, examData);
    return response.data;
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
};

export const deleteExam = async (examId) => {
  try {
    const response = await axiosInstance.delete(`/exams/${examId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
};

export const getInstructorAttemptRequests = async () => {
  try {
    const response = await axiosInstance.get('/exams/requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching attempt requests:', error);
    throw error;
  }
};

export const handleAttemptRequest = async (requestId, status, fineAmount) => {
  try {
    const response = await axiosInstance.put(`/exams/requests/${requestId}`, { status, fineAmount });
    return response.data;
  } catch (error) {
    console.error('Error handling attempt request:', error);
    throw error;
  }
};

export default {
  getStudentExams,
  getExamHistory,
  submitExamAttempt,
  requestExtraAttempt,
  checkExamEligibility,
  getInstructorExams,
  createExam,
  updateExam,
  deleteExam,
  getInstructorAttemptRequests,
  handleAttemptRequest
};
