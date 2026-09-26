import express from 'express';
import {
  getAllCourses,
  getAllAdminCourses,
  getInstructorCourses,
  getCourseById,
  enrollInCourse,
  getMyEnrolledCourses,
  updateCourseProgress,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  addCourseReview,
  addCourseQuestion,
  answerCourseQuestion,
  addCourseAnnouncement,
} from '../controllers/courseController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public browse courses
router.get('/', getAllCourses);

// Student & User routes
router.get('/my/enrolled', verifyToken, getMyEnrolledCourses);
router.get('/enrolled', verifyToken, getMyEnrolledCourses);
router.get('/instructor/my-courses', verifyToken, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/admin/all', verifyToken, authorize('admin'), getAllAdminCourses);

// Single course details
router.get('/:id', getCourseById);

// Course interactions
router.post('/:id/enroll', verifyToken, enrollInCourse);
router.post('/:id/progress', verifyToken, updateCourseProgress);
router.post('/:id/reviews', verifyToken, addCourseReview);
router.post('/:id/questions', verifyToken, addCourseQuestion);
router.post('/:id/questions/:questionId/answers', verifyToken, answerCourseQuestion);

// Instructor / Admin course management
router.post('/', verifyToken, authorize('admin', 'instructor'), createCourse);
router.put('/:id', verifyToken, authorize('admin', 'instructor'), updateCourse);
router.delete('/:id', verifyToken, authorize('admin', 'instructor'), deleteCourse);
router.put('/:id/status', verifyToken, authorize('admin'), updateCourseStatus);
router.post('/:id/announcements', verifyToken, authorize('admin', 'instructor'), addCourseAnnouncement);

export default router;
