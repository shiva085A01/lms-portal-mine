import express from 'express';
import { getAllUsers, updateProfile } from '../controllers/userController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin'), getAllUsers);
router.put('/profile', verifyToken, updateProfile);

export default router;
