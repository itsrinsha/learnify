import axiosInstance from "../features/axiosInstance";

// Create Razorpay Order
export const createOrder = async (courseId) => {
  const response = await axiosInstance.post(
    "/payments/create-order",
    {
      courseId,
    }
  );

  return response.data;
};

// Verify Payment
export const verifyPayment = async (paymentData) => {
  const response = await axiosInstance.post(
    "/payments/verify",
    paymentData
  );

  return response.data;
};

export default {
  createOrder,
  verifyPayment,
};