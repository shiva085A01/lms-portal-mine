import express from 'express';
import {
  getAllSeminars,
  registerForSeminar,
  createSeminar,
} from '../controllers/seminarController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllSeminars);
router.post('/:id/register', verifyToken, registerForSeminar);
router.post('/', verifyToken, authorize('admin', 'instructor'), createSeminar);

export default router;
