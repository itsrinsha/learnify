import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const location = useLocation();
  const getLoginPath = () => {
    if (allowedRoles?.includes('admin')) return '/admin/login';
    if (allowedRoles?.includes('instructor')) return '/instructor/login';
    return '/login';
  };

<<<<<<< HEAD:src/routes/ProtectedRoute.jsx
  const getLoginPath = () => {
    if (location.pathname.startsWith('/admin')) return '/admin/login';
    if (location.pathname.startsWith('/instructor')) return '/instructor/login';
    return '/login';
  };

  // If no user or no token, redirect to login
  if (!user || !token) {
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
  }

  // If roles are restricted and user's role doesn't match
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role.toLowerCase()))) {
    // If wrong role, redirect to home or login
    return <Navigate to="/" replace />;
=======
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements):src/components/common/ProtectedRoute.jsx
  }

  // Global Block Check
  if (user.isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  // Special check for Instructors: Must be approved to access dashboard/courses
  if (user.role === 'instructor') {
    const isVerificationPage = location.pathname.includes('/instructor/verify');
    const isPendingPage = location.pathname.includes('/instructor/pending');
<<<<<<< HEAD:src/routes/ProtectedRoute.jsx
=======
    const isApproved = user.approvalStatus === 'approved';
    const isPending = user.approvalStatus === 'pending';
    const isRejected = user.approvalStatus === 'rejected';
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements):src/components/common/ProtectedRoute.jsx

    if (isApproved) {
      // Approved instructors shouldn't be on verify or pending pages
      if (isVerificationPage || isPendingPage) {
        return <Navigate to="/instructor/dashboard" replace />;
      }
<<<<<<< HEAD:src/routes/ProtectedRoute.jsx
    } else if (user.approvalStatus === 'rejected') {
      if (!isVerificationPage && !isPendingPage) {
        return <Navigate to="/instructor/pending" replace />;
      }
    } else if (user.approvalStatus === 'pending') {
=======
    } else if (isPending || isRejected) {
      // Pending or rejected instructors must be on the pending page
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements):src/components/common/ProtectedRoute.jsx
      if (!isPendingPage) {
        return <Navigate to="/instructor/pending" replace />;
      }
    } else {
      // Unverified instructors (or any other state) must go to verification
      if (!isVerificationPage) {
        return <Navigate to="/instructor/verify" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
