import axiosInstance from '../features/axiosInstance';

export const createCourseDraft = async (courseData) => {
  try {
    const response = await axiosInstance.post('/instructor/courses/create', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course draft:', error);
    throw error;
  }
};

export const addModule = async (courseId, moduleData) => {
  try {
    const response = await axiosInstance.post(`/instructor/courses/${courseId}/modules`, moduleData);
    return response.data;
  } catch (error) {
    console.error('Error adding module:', error);
    throw error;
  }
};

export const addLesson = async (courseId, moduleId, lessonData) => {
  try {
    const response = await axiosInstance.post(`/instructor/courses/${courseId}/modules/${moduleId}/lessons`, lessonData);
    return response.data;
  } catch (error) {
    console.error('Error adding lesson:', error);
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

export const getInstructorDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/instructor/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export default {
  createCourseDraft,
  addModule,
  addLesson,
  publishCourse,
  getInstructorDashboardStats
};
