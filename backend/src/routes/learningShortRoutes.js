import express from 'express';
import {
  getShortsFeed,
  toggleLikeShort,
  recordViewShort,
} from '../controllers/learningShortController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getShortsFeed);
router.post('/:id/like', verifyToken, toggleLikeShort);
router.post('/:id/view', recordViewShort);

export default router;
