import express from 'express';
import {
  evaluateCode,
  tutorChat,
  generateQuiz,
  analyzeResume,
} from '../controllers/aiController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// All AI endpoints are protected for authenticated LMS users
router.post('/evaluate', verifyToken, evaluateCode);
router.post('/tutor-chat', verifyToken, tutorChat);
router.post('/generate-quiz', verifyToken, generateQuiz);
router.post('/analyze-resume', verifyToken, analyzeResume);

export default router;
