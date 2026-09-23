import StudyRoom from '../models/StudyRoom.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all active study rooms
 * @route   GET /api/study-rooms
 * @access  Private
 */
export const getAllStudyRooms = asyncHandler(async (req, res) => {
  const rooms = await StudyRoom.find()
    .populate('creator', 'name email profileImage')
    .populate('members', 'name email profileImage')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'Study rooms retrieved', rooms);
});

/**
 * @desc    Create a new study room
 * @route   POST /api/study-rooms
 * @access  Private
 */
export const createStudyRoom = asyncHandler(async (req, res) => {
  const { name, topic, description, courseCategory, maxMembers, currentGoal, tags } = req.body;

  const room = await StudyRoom.create({
    name,
    topic,
    description: description || '',
    courseCategory: courseCategory || 'General',
    maxMembers: maxMembers || 10,
    currentGoal: currentGoal || 'Collaborative learning',
    tags: tags || [],
    creator: req.user.id,
    creatorName: req.user.name,
    members: [req.user.id], // creator automatically joins
  });

  return successResponse(res, 201, 'Study room created successfully', room);
});

/**
 * @desc    Join a study room
 * @route   POST /api/study-rooms/:id/join
 * @access  Private
 */
export const joinStudyRoom = asyncHandler(async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);
  if (!room) {
    return errorResponse(res, 404, 'Study room not found');
  }

  const userId = req.user.id;
  if (room.members.some((id) => id.toString() === userId)) {
    return successResponse(res, 200, 'Already a member of this study room', room);
  }

  if (room.members.length >= room.maxMembers) {
    return errorResponse(res, 400, 'This study room is currently full');
  }

  room.members.push(userId);
  if (room.members.length >= room.maxMembers) {
    room.status = 'full';
  }

  await room.save();
  await room.populate('members', 'name email profileImage');

  return successResponse(res, 200, 'Joined study room successfully', room);
});

/**
 * @desc    Leave a study room
 * @route   POST /api/study-rooms/:id/leave
 * @access  Private
 */
export const leaveStudyRoom = asyncHandler(async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);
  if (!room) {
    return errorResponse(res, 404, 'Study room not found');
  }

  const userId = req.user.id;
  room.members = room.members.filter((id) => id.toString() !== userId);
  if (room.status === 'full' && room.members.length < room.maxMembers) {
    room.status = 'active';
  }

  await room.save();
  return successResponse(res, 200, 'Left study room successfully');
});
