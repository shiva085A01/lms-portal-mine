import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  StudentProtectedRoute,
  AdminProtectedRoute,
  InstructorProtectedRoute,
} from '../components/common/ProtectedRoute';

// Public & Auth Pages
import AppHome from '../App';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import BookshelfPage from '../pages/BookshelfPage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import CourseCatalog from '../pages/student/CourseCatalog';
import ScrollableLearning from '../pages/student/ScrollableLearning';
import StudyRooms from '../pages/student/StudyRooms';
import Seminars from '../pages/student/Seminars';
import CareerBuilding from '../pages/student/CareerBuilding';
import WeeklyFeedback from '../pages/student/WeeklyFeedback';

// Instructor Pages
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import InstructorCourses from '../pages/instructor/InstructorCourses';
import InstructorSeminars from '../pages/instructor/InstructorSeminars';
import InstructorGrading from '../pages/instructor/InstructorGrading';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminSeminars from '../pages/admin/AdminSeminars';
import AdminFeedback from '../pages/admin/AdminFeedback';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<AppHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Student Protected Pages */}
      <Route
        path="/student/dashboard"
        element={
          <StudentProtectedRoute>
            <StudentDashboard />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/bookshelf"
        element={
          <StudentProtectedRoute>
            <BookshelfPage />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/bookshelf"
        element={
          <StudentProtectedRoute>
            <BookshelfPage />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <StudentProtectedRoute>
            <CourseCatalog />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/learning-shorts"
        element={
          <StudentProtectedRoute>
            <ScrollableLearning />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/study-rooms"
        element={
          <StudentProtectedRoute>
            <StudyRooms />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/seminars"
        element={
          <StudentProtectedRoute>
            <Seminars />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/career"
        element={
          <StudentProtectedRoute>
            <CareerBuilding />
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/student/feedback"
        element={
          <StudentProtectedRoute>
            <WeeklyFeedback />
          </StudentProtectedRoute>
        }
      />

      {/* Instructor Protected Pages */}
      <Route
        path="/instructor/dashboard"
        element={
          <InstructorProtectedRoute>
            <InstructorDashboard />
          </InstructorProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses"
        element={
          <InstructorProtectedRoute>
            <InstructorCourses />
          </InstructorProtectedRoute>
        }
      />
      <Route
        path="/instructor/seminars"
        element={
          <InstructorProtectedRoute>
            <InstructorSeminars />
          </InstructorProtectedRoute>
        }
      />
      <Route
        path="/instructor/grading"
        element={
          <InstructorProtectedRoute>
            <InstructorGrading />
          </InstructorProtectedRoute>
        }
      />

      {/* Admin Protected Pages */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/seminars"
        element={
          <AdminProtectedRoute>
            <AdminSeminars />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <AdminProtectedRoute>
            <AdminFeedback />
          </AdminProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
