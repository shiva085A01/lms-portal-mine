import express from 'express';
import {
  getAllUsers,
  getInstructorStudents,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  updateProfile,
} from '../controllers/userController.js';
import { verifyToken, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin'), getAllUsers);
router.get('/instructor/students', verifyToken, authorize('instructor', 'admin'), getInstructorStudents);
router.post('/', verifyToken, authorize('admin'), createUser);
router.put('/profile', verifyToken, updateProfile);
router.put('/:id/role', verifyToken, authorize('admin'), updateUserRole);
router.put('/:id/status', verifyToken, authorize('admin'), toggleUserStatus);
router.delete('/:id', verifyToken, authorize('admin'), deleteUser);

export default router;
