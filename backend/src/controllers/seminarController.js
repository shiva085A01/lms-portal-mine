import Seminar from '../models/Seminar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all seminars
 * @route   GET /api/seminars
 * @access  Public
 */
export const getAllSeminars = asyncHandler(async (req, res) => {
  const seminars = await Seminar.find().sort({ date: 1 });
  return successResponse(res, 200, 'Seminars retrieved', seminars);
});

/**
 * @desc    Register for a seminar
 * @route   POST /api/seminars/:id/register
 * @access  Private (Student)
 */
export const registerForSeminar = asyncHandler(async (req, res) => {
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar) {
    return errorResponse(res, 404, 'Seminar not found');
  }

  const userId = req.user.id;
  if (seminar.registrations.some((id) => id.toString() === userId)) {
    return successResponse(res, 200, 'Already registered for this seminar', seminar);
  }

  seminar.registrations.push(userId);
  await seminar.save();

  return successResponse(res, 200, 'Registered for seminar successfully', seminar);
});

/**
 * @desc    Create a seminar (Admin only)
 * @route   POST /api/seminars
 * @access  Private (Admin)
 */
export const createSeminar = asyncHandler(async (req, res) => {
  const seminar = await Seminar.create(req.body);
  return successResponse(res, 201, 'Seminar scheduled successfully', seminar);
});
