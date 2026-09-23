import express from 'express';
import { getPlatformOverview } from '../controllers/analyticsController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/overview', verifyToken, authorize('admin'), getPlatformOverview);

export default router;
