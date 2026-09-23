import express from 'express';
import {
  getCareerResources,
  getCareerResourceById,
} from '../controllers/careerController.js';

const router = express.Router();

router.get('/', getCareerResources);
router.get('/:id', getCareerResourceById);

export default router;
