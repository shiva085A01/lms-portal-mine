import express from 'express';
import {
  getAllStudyRooms,
  createStudyRoom,
  joinStudyRoom,
  leaveStudyRoom,
} from '../controllers/studyRoomController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllStudyRooms);
router.post('/', verifyToken, createStudyRoom);
router.post('/:id/join', verifyToken, joinStudyRoom);
router.post('/:id/leave', verifyToken, leaveStudyRoom);

export default router;
