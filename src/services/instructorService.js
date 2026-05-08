import axiosInstance from '../features/axiosInstance';

export const getInstructorDashboard = async () => {
  try {
    const response = await axiosInstance.get('/instructor/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    throw error;
  }
};

export const getInstructorCourses = async () => {
  try {
    const response = await axiosInstance.get('/instructor/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    throw error;
  }
};

export const publishCourse = async (courseId) => {
  try {
    const response = await axiosInstance.put(`/instructor/courses/${courseId}/publish`);
    return response.data;
  } catch (error) {
    console.error('Error publishing course:', error);
    throw error;
  }
};

export default {
  getInstructorDashboard,
  getInstructorCourses,
  publishCourse,
};
