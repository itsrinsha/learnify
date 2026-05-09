import axiosInstance from '../features/axiosInstance';

export const getMyLiveSessions = async () => {
  try {
    const response = await axiosInstance.get('/users/my-live-sessions');
    return response.data;
  } catch (error) {
    console.error('Error fetching my live sessions:', error);
    throw error;
  }
};

export default {
  getMyLiveSessions,
};
