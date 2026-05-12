import axiosInstance from '../features/axiosInstance';

export const createLiveSession = async (sessionData) => {
  const response = await axiosInstance.post('/live', sessionData);
  return response.data;
};

export const getInstructorLiveSessions = async () => {
  const response = await axiosInstance.get('/live/instructor-sessions');
  return response.data;
};

export const getMyLiveSessions = async () => {
  const response = await axiosInstance.get('/live/my-sessions');
  return response.data;
};

export const startLiveSession = async (sessionId) => {
  const response = await axiosInstance.put(`/live/${sessionId}/start`);
  return response.data;
};

export const endLiveSession = async (sessionId) => {
  const response = await axiosInstance.put(`/live/${sessionId}/end`);
  return response.data;
};

export default {
  createLiveSession,
  getInstructorLiveSessions,
  getMyLiveSessions,
  startLiveSession,
  endLiveSession
};
