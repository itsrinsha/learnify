import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    const loginPath = allowedRoles.includes('instructor') ? '/instructor/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if role not allowed
    return <Navigate to="/" replace />;
  }

  // Special check for Instructors: Must be approved to access dashboard/courses
  if (user.role === 'instructor') {
    const isVerificationPage = location.pathname.includes('/instructor/verify');
    const isPendingPage = location.pathname.includes('/instructor/pending');
    
    // Check if user has already submitted verification
    const hasSubmitted = user.verificationDetails?.expertise || user.approvalStatus === 'pending';

    if (user.approvalStatus === 'approved') {
      if (isVerificationPage || isPendingPage) {
        return <Navigate to="/instructor/dashboard" replace />;
      }
    } else if (user.approvalStatus === 'rejected') {
       if (!isVerificationPage && !isPendingPage) {
         return <Navigate to="/instructor/pending" replace />;
       }
    } else if (user.approvalStatus === 'pending') {
      if (!isPendingPage) {
        return <Navigate to="/instructor/pending" replace />;
      }
    } else {
      // unverified
      if (!isVerificationPage) {
        return <Navigate to="/instructor/verify" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
