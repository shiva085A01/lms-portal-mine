import express from 'express';
import {
  submitQuiz,
  getMyQuizAttempts,
  getInstructorQuizAttempts,
} from '../controllers/quizController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/submit', verifyToken, submitQuiz);
router.get('/my-attempts', verifyToken, getMyQuizAttempts);
router.get('/instructor', verifyToken, authorize('instructor', 'admin'), getInstructorQuizAttempts);

export default router;
