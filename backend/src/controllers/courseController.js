import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all published courses with search & filter
 * @route   GET /api/courses
 * @access  Public
 */
export const getAllCourses = asyncHandler(async (req, res) => {
  const { search, category, difficulty } = req.query;
  const query = { published: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (difficulty && difficulty !== 'All') {
    query.difficulty = difficulty;
  }

  const courses = await Course.find(query)
    .populate('instructor', 'name email profileImage')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'Courses retrieved successfully', courses);
});

/**
 * @desc    Get course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'instructor',
    'name email profileImage bio'
  );

  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  return successResponse(res, 200, 'Course details retrieved', course);
});

/**
 * @desc    Enroll in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Student)
 */
export const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    return successResponse(
      res,
      200,
      'Already enrolled in this course',
      existingEnrollment
    );
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    completionPercentage: 0,
    completedLessons: [],
  });

  // Increment enrolled count on course
  course.enrolledStudentsCount = (course.enrolledStudentsCount || 0) + 1;
  await course.save();

  return successResponse(res, 201, 'Successfully enrolled in course!', enrollment);
});

/**
 * @desc    Get enrolled courses for logged-in student
 * @route   GET /api/courses/my/enrolled
 * @access  Private (Student)
 */
export const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user.id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email profileImage' },
    })
    .sort({ lastAccessedAt: -1 });

  return successResponse(res, 200, 'My enrolled courses retrieved', enrollments);
});

/**
 * @desc    Create a new course (Admin only)
 * @route   POST /api/courses
 * @access  Private (Admin)
 */
export const createCourse = asyncHandler(async (req, res) => {
  const courseData = {
    ...req.body,
    instructor: req.user.id,
    instructorName: req.user.name,
  };

  const course = await Course.create(courseData);
  return successResponse(res, 201, 'Course created successfully', course);
});
