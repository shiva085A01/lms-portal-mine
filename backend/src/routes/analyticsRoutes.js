import express from 'express';
import {
  getPlatformOverview,
  getInstructorAnalytics,
} from '../controllers/analyticsController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/overview', verifyToken, authorize('admin', 'instructor'), getPlatformOverview);
router.get('/instructor', verifyToken, authorize('instructor', 'admin'), getInstructorAnalytics);

export default router;
