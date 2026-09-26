import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-ink-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-terracotta-500/20 border-t-terracotta-500 animate-spin"></div>
          <p className="text-stone-600 dark:text-stone-400 text-xs font-mono animate-pulse">Authenticating LMS session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If authenticated user tries to access unauthorized role page
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === 'instructor') {
      return <Navigate to="/instructor/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export const StudentProtectedRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['student']}>{children}</ProtectedRoute>
);

export const AdminProtectedRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);

export const InstructorProtectedRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['instructor', 'admin']}>{children}</ProtectedRoute>
);

export default ProtectedRoute;
