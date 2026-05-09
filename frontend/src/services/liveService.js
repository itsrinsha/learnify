import axiosInstance from '../features/axiosInstance';

export const getMyLiveSessions = async () => {
  try {
    const response = await axiosInstance.get('/users/my-live-sessions');
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching my live sessions:', error);
    throw error;
  }
};

export default {
  getMyLiveSessions,
};
