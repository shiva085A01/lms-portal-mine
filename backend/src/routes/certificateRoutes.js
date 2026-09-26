import express from 'express';
import {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
} from '../controllers/certificateController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/generate', verifyToken, generateCertificate);
router.get('/my', verifyToken, getMyCertificates);
router.get('/verify/:certificateId', verifyCertificate);

export default router;
