import axiosInstance from '../features/axiosInstance';

export const getMyCertificates = async () => {
  try {
    const response = await axiosInstance.get('/certificates/my-certificates');
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

export const claimCertificate = async (examId) => {
  try {
    const response = await axiosInstance.post('/certificates/claim', { examId });
    return response.data;
  } catch (error) {
    console.error('Error claiming certificate:', error);
    throw error;
  }
};

export const getCertificateDownloadUrl = (certId) => {
  return `${import.meta.env.VITE_API_BASE_URL}/certificates/download/${certId}`;
};

export default {
  getMyCertificates,
  claimCertificate,
  getCertificateDownloadUrl
};
