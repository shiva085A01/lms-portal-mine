import express from 'express';
import {
  submitAssignment,
  getMySubmissions,
  getInstructorSubmissions,
  gradeSubmission,
} from '../controllers/submissionController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, submitAssignment);
router.get('/my', verifyToken, getMySubmissions);
router.get('/instructor', verifyToken, authorize('instructor', 'admin'), getInstructorSubmissions);
router.put('/:id/grade', verifyToken, authorize('instructor', 'admin'), gradeSubmission);

export default router;
