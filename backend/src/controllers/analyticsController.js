import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Submission from '../models/Submission.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Certificate from '../models/Certificate.js';
import StudyRoom from '../models/StudyRoom.js';
import Seminar from '../models/Seminar.js';
import Feedback from '../models/Feedback.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get complete real platform overview statistics
 * @route   GET /api/analytics/overview
 * @access  Private (Admin, Instructor)
 */
export const getPlatformOverview = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalInstructors,
    totalAdmins,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalSubmissions,
    gradedSubmissions,
    totalQuizAttempts,
    totalCertificates,
    totalStudyRooms,
    totalSeminars,
    totalFeedbacks,
    recentUsers,
    recentCourses,
    recentEnrollments,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    User.countDocuments({ role: 'admin' }),
    Course.countDocuments(),
    Course.countDocuments({ published: true }),
    Enrollment.countDocuments(),
    Submission.countDocuments(),
    Submission.countDocuments({ status: 'graded' }),
    QuizAttempt.countDocuments(),
    Certificate.countDocuments(),
    StudyRoom.countDocuments(),
    Seminar.countDocuments(),
    Feedback.countDocuments(),
    User.find().select('-password').sort({ createdAt: -1 }).limit(6),
    Course.find().select('title category enrolledStudentsCount rating price status published instructorName').sort({ createdAt: -1 }).limit(6),
    Enrollment.find().populate('student', 'name email').populate('course', 'title category').sort({ enrolledAt: -1 }).limit(6),
  ]);

  return successResponse(res, 200, 'Platform analytics retrieved', {
    metrics: {
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalSubmissions,
      gradedSubmissions,
      totalQuizAttempts,
      totalCertificates,
      totalStudyRooms,
      totalSeminars,
      totalFeedbacks,
    },
    recentUsers,
    recentCourses,
    recentEnrollments,
  });
});

/**
 * @desc    Get Instructor Dashboard Specific Analytics
 * @route   GET /api/analytics/instructor
 * @access  Private (Instructor, Admin)
 */
export const getInstructorAnalytics = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;
  const query = req.user.role === 'admin' ? {} : { instructor: instructorId };

  const courses = await Course.find(query).select('_id title enrolledStudentsCount rating');
  const courseIds = courses.map((c) => c._id);

  const [
    totalEnrollments,
    totalSubmissions,
    pendingSubmissions,
    totalQuizAttempts,
    mySeminars,
    recentSubmissions,
  ] = await Promise.all([
    Enrollment.countDocuments({ course: { $in: courseIds } }),
    Submission.countDocuments({ course: { $in: courseIds } }),
    Submission.countDocuments({ course: { $in: courseIds }, status: 'pending' }),
    QuizAttempt.countDocuments({ course: { $in: courseIds } }),
    Seminar.countDocuments(),
    Submission.find({ course: { $in: courseIds } })
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ submittedAt: -1 })
      .limit(6),
  ]);

  return successResponse(res, 200, 'Instructor analytics retrieved', {
    totalCourses: courses.length,
    totalStudents: totalEnrollments,
    totalSubmissions,
    pendingSubmissions,
    totalQuizAttempts,
    totalSeminars: mySeminars,
    courses,
    recentSubmissions,
  });
});
