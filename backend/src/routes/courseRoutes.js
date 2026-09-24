import express from 'express';
import {
  getAllCourses,
  getCourseById,
  enrollInCourse,
  getMyEnrolledCourses,
  createCourse,
} from '../controllers/courseController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/my/enrolled', verifyToken, getMyEnrolledCourses);
router.get('/:id', getCourseById);
router.post('/:id/enroll', verifyToken, enrollInCourse);
router.post('/', verifyToken, authorize('admin', 'instructor'), createCourse);

export default router;
