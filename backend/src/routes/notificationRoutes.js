import express from 'express';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notificationController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, getMyNotifications);
router.put('/:id/read', verifyToken, markNotificationAsRead);
router.put('/read-all', verifyToken, markAllNotificationsAsRead);

export default router;
