import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const getLoginPath = () => {
    if (allowedRoles?.includes('admin')) return '/admin/login';
    if (allowedRoles?.includes('instructor')) return '/instructor/login';
    return '/login';
  };

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
  }

  // Special check for Instructors: Must be approved to access dashboard/courses
  if (user.role === 'instructor') {
    const isVerificationPage = location.pathname.includes('/instructor/verify');
    const isPendingPage = location.pathname.includes('/instructor/pending');
    const isApproved = user.approvalStatus === 'approved';
    const isPending = user.approvalStatus === 'pending';
    const isRejected = user.approvalStatus === 'rejected';

    if (isApproved) {
      // Approved instructors shouldn't be on verify or pending pages
      if (isVerificationPage || isPendingPage) {
        return <Navigate to="/instructor/dashboard" replace />;
      }
    } else if (isPending || isRejected) {
      // Pending or rejected instructors must be on the pending page
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
