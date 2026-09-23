import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const query = {};

  if (role && role !== 'All') {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  return successResponse(res, 200, 'Users retrieved', users);
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, skills, interests } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined) user.skills = skills;
  if (interests !== undefined) user.interests = interests;

  await user.save();

  return successResponse(res, 200, 'Profile updated successfully', {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    phone: user.phone,
    bio: user.bio,
    skills: user.skills,
    interests: user.interests,
  });
});
