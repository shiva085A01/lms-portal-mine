import CareerResource from '../models/CareerResource.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get career resources by category or all
 * @route   GET /api/career
 * @access  Public
 */
export const getCareerResources = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = {};
  if (category && category !== 'all') {
    query.category = category;
  }

  const resources = await CareerResource.find(query).sort({ createdAt: -1 });
  return successResponse(res, 200, 'Career resources retrieved', resources);
});

/**
 * @desc    Get single career resource
 * @route   GET /api/career/:id
 * @access  Public
 */
export const getCareerResourceById = asyncHandler(async (req, res) => {
  const resource = await CareerResource.findById(req.params.id);
  if (!resource) {
    return errorResponse(res, 404, 'Resource not found');
  }
  return successResponse(res, 200, 'Resource details retrieved', resource);
});
