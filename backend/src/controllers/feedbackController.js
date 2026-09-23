import Feedback from '../models/Feedback.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Submit weekly feedback
 * @route   POST /api/feedback
 * @access  Private (Student)
 */
export const submitFeedback = asyncHandler(async (req, res) => {
  const { weekNumber, rating, learned, difficulties, suggestions, confidenceLevel } = req.body;

  const feedback = await Feedback.create({
    student: req.user.id,
    studentName: req.user.name,
    weekNumber: weekNumber || 1,
    rating,
    learned,
    difficulties: difficulties || '',
    suggestions: suggestions || '',
    confidenceLevel: confidenceLevel || 'High',
  });

  return successResponse(res, 201, 'Weekly feedback submitted successfully! Thank you.', feedback);
});

/**
 * @desc    Get student feedback history
 * @route   GET /api/feedback/my
 * @access  Private (Student)
 */
export const getMyFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ student: req.user.id }).sort({ createdAt: -1 });
  return successResponse(res, 200, 'Your feedback submissions retrieved', feedbacks);
});

/**
 * @desc    Get all feedback submissions (Admin)
 * @route   GET /api/feedback
 * @access  Private (Admin)
 */
export const getAllFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate('student', 'name email')
    .sort({ createdAt: -1 });
  return successResponse(res, 200, 'All student feedback retrieved', feedbacks);
});
