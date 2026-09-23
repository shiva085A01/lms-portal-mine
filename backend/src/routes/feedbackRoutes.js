import express from 'express';
import {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
} from '../controllers/feedbackController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, submitFeedback);
router.get('/my', verifyToken, getMyFeedback);
router.get('/', verifyToken, authorize('admin'), getAllFeedback);

export default router;
