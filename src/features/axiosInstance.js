import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor (attach token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Response Interceptor (handle errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Unauthorized (token expired)
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: redirect to login page
      window.location.href = "/login";
    }

    // Blocked account checking
    if (error.response && error.response.status === 403) {
      const isBlockedError = error.response.data?.message === "Your account has been blocked." || 
                             error.response.data?.message?.toLowerCase().includes("blocked");
      
      if (isBlockedError) {
        console.log("User is blocked. Redirecting to /blocked page...");
        const reason = error.response.data?.reason || "Your account has been restricted by an administrator.";
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            user.isBlocked = true;
            user.blockedReason = reason;
            localStorage.setItem("user", JSON.stringify(user));
          } catch (e) {
            console.error(e);
          }
        }
        localStorage.removeItem("token");
        window.location.href = "/blocked";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 
