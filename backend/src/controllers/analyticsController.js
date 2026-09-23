import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import StudyRoom from '../models/StudyRoom.js';
import Seminar from '../models/Seminar.js';
import Feedback from '../models/Feedback.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get complete real platform overview statistics
 * @route   GET /api/analytics/overview
 * @access  Private (Admin)
 */
export const getPlatformOverview = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    totalEnrollments,
    totalStudyRooms,
    totalSeminars,
    totalFeedbacks,
    recentUsers,
    recentCourses,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    StudyRoom.countDocuments(),
    Seminar.countDocuments(),
    Feedback.countDocuments(),
    User.find().select('-password').sort({ createdAt: -1 }).limit(5),
    Course.find().select('title category enrolledStudentsCount rating price').sort({ createdAt: -1 }).limit(5),
  ]);

  return successResponse(res, 200, 'Platform analytics retrieved', {
    metrics: {
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
      totalStudyRooms,
      totalSeminars,
      totalFeedbacks,
    },
    recentUsers,
    recentCourses,
  });
});
