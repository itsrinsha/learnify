import axiosInstance from '../features/axiosInstance';

export const getMyLiveSessions = async () => {
  try {
    const response = await axiosInstance.get('/users/my-live-sessions');
<<<<<<< HEAD
=======
    console.log(response.data)
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
    return response.data;
  } catch (error) {
    console.error('Error fetching my live sessions:', error);
    throw error;
  }
};

<<<<<<< HEAD
export const getInstructorLiveSessions = async () => {
  try {
    const response = await axiosInstance.get('/live/my-sessions');
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor live sessions:', error);
    throw error;
  }
};

export const createLiveSession = async (sessionData) => {
  const response = await axiosInstance.post('/live', sessionData);
  return response.data;
};

export const startLiveSession = async (id) => {
  const response = await axiosInstance.put(`/live/${id}/start`);
  return response.data;
};

export const endLiveSession = async (id) => {
  const response = await axiosInstance.put(`/live/${id}/end`);
  return response.data;
};

export const deleteLiveSession = async (id) => {
  const response = await axiosInstance.delete(`/live/${id}`);
  return response.data;
};

export default {
  getMyLiveSessions,
  getInstructorLiveSessions,
  createLiveSession,
  startLiveSession,
  endLiveSession,
  deleteLiveSession,
=======
export default {
  getMyLiveSessions,
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
};
