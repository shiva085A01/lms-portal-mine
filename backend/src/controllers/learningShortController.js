import LearningShort from '../models/LearningShort.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get Reels/Shorts feed
 * @route   GET /api/learning-shorts
 * @access  Public
 */
export const getShortsFeed = asyncHandler(async (req, res) => {
  const shorts = await LearningShort.find()
    .populate('courseRef', 'title category')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'Learning shorts retrieved', shorts);
});

/**
 * @desc    Toggle like on a short
 * @route   POST /api/learning-shorts/:id/like
 * @access  Private
 */
export const toggleLikeShort = asyncHandler(async (req, res) => {
  const short = await LearningShort.findById(req.params.id);
  if (!short) {
    return errorResponse(res, 404, 'Learning short not found');
  }

  const userId = req.user.id;
  const alreadyLiked = short.likedBy.includes(userId);

  if (alreadyLiked) {
    short.likedBy = short.likedBy.filter((id) => id.toString() !== userId);
    short.likesCount = Math.max(0, short.likesCount - 1);
  } else {
    short.likedBy.push(userId);
    short.likesCount += 1;
  }

  await short.save();
  return successResponse(res, 200, alreadyLiked ? 'Unliked' : 'Liked', {
    likesCount: short.likesCount,
    isLiked: !alreadyLiked,
  });
});

/**
 * @desc    Record a view on a short
 * @route   POST /api/learning-shorts/:id/view
 * @access  Public
 */
export const recordViewShort = asyncHandler(async (req, res) => {
  const short = await LearningShort.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewsCount: 1 } },
    { new: true }
  );

  if (!short) {
    return errorResponse(res, 404, 'Learning short not found');
  }

  return successResponse(res, 200, 'View recorded', { viewsCount: short.viewsCount });
});
