import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, status } = req.query;
  const query = {};

  if (role && role !== 'All') {
    query.role = role;
  }

  if (status && status !== 'All') {
    query.isActive = status === 'active';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  return successResponse(res, 200, 'Users retrieved', users);
});

/**
 * @desc    Get all students enrolled in logged-in instructor's courses
 * @route   GET /api/users/instructor/students
 * @access  Private (Instructor, Admin)
 */
export const getInstructorStudents = asyncHandler(async (req, res) => {
  let courseQuery = {};
  if (req.user.role !== 'admin') {
    courseQuery = { instructor: req.user.id };
  }

  const instructorCourses = await Course.find(courseQuery).select('_id title category');
  const courseIds = instructorCourses.map((c) => c._id);

  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'name email profileImage phone bio skills')
    .populate('course', 'title category')
    .sort({ enrolledAt: -1 });

  return successResponse(res, 200, 'Instructor enrolled students retrieved', enrollments);
});

/**
 * @desc    Admin Create User
 * @route   POST /api/users
 * @access  Private (Admin)
 */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, phone } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, 400, 'Please provide name, email, and password');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return errorResponse(res, 400, 'A user with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'student',
    bio: bio || '',
    phone: phone || '',
  });

  return successResponse(res, 201, 'User account created successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
});

/**
 * @desc    Admin Update User Role
 * @route   PUT /api/users/:id/role
 * @access  Private (Admin)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['student', 'instructor', 'admin'].includes(role)) {
    return errorResponse(res, 400, 'Invalid role provided');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  user.role = role;
  await user.save();

  return successResponse(res, 200, `User role changed to ${role}`, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

/**
 * @desc    Admin Toggle User Status (Activate/Suspend)
 * @route   PUT /api/users/:id/status
 * @access  Private (Admin)
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  user.isActive = req.body.isActive !== undefined ? req.body.isActive : !user.isActive;
  await user.save();

  return successResponse(
    res,
    200,
    `User status is now ${user.isActive ? 'Active' : 'Suspended'}`,
    {
      _id: user._id,
      name: user.name,
      isActive: user.isActive,
    }
  );
});

/**
 * @desc    Admin Delete User
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  if (user._id.toString() === req.user.id) {
    return errorResponse(res, 400, 'Admin cannot delete their own active session account');
  }

  await User.findByIdAndDelete(req.params.id);
  await Enrollment.deleteMany({ student: req.params.id });

  return successResponse(res, 200, 'User and associated records removed successfully');
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
