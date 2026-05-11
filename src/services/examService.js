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

export default {
  getStudentExams,
  getExamHistory,
  submitExamAttempt,
  requestExtraAttempt,
  checkExamEligibility
};
