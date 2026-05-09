import axiosInstance from '../features/axiosInstance';

export const getCourseProgress = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/progress/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course progress:', error);
    throw error;
  }
};

export const markLessonCompleted = async (courseId, lessonId) => {
  try {
    const response = await axiosInstance.post('/progress/mark-completed', { courseId, lessonId });
    return response.data;
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    throw error;
  }
};

export default {
  getCourseProgress,
  markLessonCompleted,
};
