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

<<<<<<< HEAD
// Record Payment Failure
export const recordPaymentFailure = async (failureData) => {
  const response = await axiosInstance.post(
    "/payments/record-failure",
    failureData
  );

  return response.data;
};

export default {
  createOrder,
  verifyPayment,
  recordPaymentFailure,
=======
export default {
  createOrder,
  verifyPayment,
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
};