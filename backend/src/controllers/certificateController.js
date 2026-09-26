import Certificate from '../models/Certificate.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Generate certificate for completed course
 * @route   POST /api/certificates/generate
 * @access  Private (Student)
 */
export const generateCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (!enrollment) {
    return errorResponse(res, 400, 'You are not enrolled in this course.');
  }

  // Check if existing certificate
  let cert = await Certificate.findOne({
    student: studentId,
    course: courseId,
  });

  if (cert) {
    return successResponse(res, 200, 'Certificate already issued', cert);
  }

  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const certId = `CERT-${course.category.substring(0, 3).toUpperCase()}-${randomSuffix}`;
  const user = await User.findById(studentId);

  cert = await Certificate.create({
    certificateId: certId,
    student: studentId,
    studentName: user.name,
    studentEmail: user.email,
    course: course._id,
    courseTitle: course.title,
    instructorName: course.instructorName || 'Faculty Lead',
    skillsCovered: course.learningOutcomes || [],
    issueDate: new Date(),
    grade: enrollment.completionPercentage >= 95 ? 'A+ Honors' : 'A First Class',
    verified: true,
  });

  enrollment.certificateIssued = true;
  enrollment.certificateId = certId;
  enrollment.status = 'completed';
  enrollment.completionPercentage = 100;
  await enrollment.save();

  return successResponse(res, 201, 'Congratulations! Your Certificate of Completion has been generated.', cert);
});

/**
 * @desc    Get all certificates earned by logged-in student
 * @route   GET /api/certificates/my
 * @access  Private
 */
export const getMyCertificates = asyncHandler(async (req, res) => {
  const certs = await Certificate.find({ student: req.user.id })
    .populate('course', 'title category thumbnail difficulty duration')
    .sort({ issueDate: -1 });

  return successResponse(res, 200, 'Certificates retrieved successfully', certs);
});

/**
 * @desc    Verify certificate authenticity by ID
 * @route   GET /api/certificates/verify/:certificateId
 * @access  Public
 */
export const verifyCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
    .populate('course', 'title category thumbnail difficulty duration')
    .populate('student', 'name email profileImage');

  if (!cert) {
    return errorResponse(res, 404, 'Invalid certificate ID or certificate not found.');
  }

  return successResponse(res, 200, 'Certificate verification successful. This credential is authentic.', cert);
});
