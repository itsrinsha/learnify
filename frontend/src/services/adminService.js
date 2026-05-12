import axiosInstance from '../features/axiosInstance';

// Stats
export const getAdminStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};

// Users
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

// Courses
export const getAllCourses = async () => {
  const response = await axiosInstance.get('/admin/courses');
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/admin/courses/${id}`);
  return response.data;
};

export const updateCourseStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/admin/courses/${id}/status`, { status });
  return response.data;
};

// Instructor Requests
export const getInstructorRequests = async () => {
  const response = await axiosInstance.get('/admin/instructor-requests');
  return response.data;
};

export const approveInstructor = async (id) => {
  const response = await axiosInstance.patch(`/admin/approve-instructor/${id}`);
  return response.data;
};

export const rejectInstructor = async (id) => {
  const response = await axiosInstance.patch(`/admin/reject-instructor/${id}`);
  return response.data;
};

// Categories
export const getAllCategories = async () => {
  const response = await axiosInstance.get('/admin/categories');
  return response.data;
};

export const addCategory = async (data) => {
  const response = await axiosInstance.post('/admin/categories', data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/admin/categories/${id}`);
  return response.data;
};

// Offers
export const getAllOffers = async () => {
  const response = await axiosInstance.get('/admin/offers');
  return response.data;
};

export const addOffer = async (data) => {
  const response = await axiosInstance.post('/admin/offers', data);
  return response.data;
};

export const deleteOffer = async (id) => {
  const response = await axiosInstance.delete(`/admin/offers/${id}`);
  return response.data;
};

// Earnings
export const getEarnings = async () => {
  const response = await axiosInstance.get('/admin/earnings');
  return response.data;
};

// Availability
export const getInstructorAvailability = async () => {
  const response = await axiosInstance.get('/admin/availability');
  return response.data;
};

export const getAdminLiveSessions = async () => {
  const response = await axiosInstance.get('/admin/live-sessions');
  return response.data;
};

export default {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse,
  updateCourseStatus,
  getInstructorRequests,
  approveInstructor,
  rejectInstructor,
  getAllCategories,
  addCategory,
  deleteCategory,
  getAllOffers,
  addOffer,
  deleteOffer,
  getEarnings,
  getInstructorAvailability,
  getAdminLiveSessions
};
