import axiosInstance from '../features/axiosInstance';

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

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

export default {
  getAllUsers,
  getInstructorRequests,
  approveInstructor,
  rejectInstructor,
};
