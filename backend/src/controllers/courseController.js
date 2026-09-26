import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
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
      { instructorName: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (difficulty && difficulty !== 'All') {
    query.difficulty = difficulty;
  }

  const courses = await Course.find(query)
    .populate('instructor', 'name email profileImage bio')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'Courses retrieved successfully', courses);
});

/**
 * @desc    Get all courses across platform (Admin only)
 * @route   GET /api/courses/admin/all
 * @access  Private (Admin)
 */
export const getAllAdminCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate('instructor', 'name email profileImage')
    .sort({ createdAt: -1 });

  return successResponse(res, 200, 'All platform courses retrieved', courses);
});

/**
 * @desc    Get courses created by the logged-in instructor
 * @route   GET /api/courses/instructor/my-courses
 * @access  Private (Instructor, Admin)
 */
export const getInstructorCourses = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { instructor: req.user.id };
  const courses = await Course.find(query).sort({ createdAt: -1 });

  return successResponse(res, 200, 'Instructor courses retrieved', courses);
});

/**
 * @desc    Get course by ID with complete details
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email profileImage bio skills')
    .populate('discussions.user', 'name profileImage role')
    .populate('discussions.answers.user', 'name profileImage role')
    .populate('reviews.student', 'name profileImage');

  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  return successResponse(res, 200, 'Course details retrieved', course);
});

/**
 * @desc    Enroll in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Student, Instructor, Admin)
 */
export const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  // Check if already enrolled
  let enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (enrollment) {
    return successResponse(
      res,
      200,
      'Already enrolled in this course',
      enrollment
    );
  }

  enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    completionPercentage: 0,
    completedLessons: [],
    status: 'active',
  });

  // Increment enrolled count on course
  course.enrolledStudentsCount = (course.enrolledStudentsCount || 0) + 1;
  await course.save();

  return successResponse(res, 201, 'Successfully enrolled in course!', enrollment);
});

/**
 * @desc    Get enrolled courses for logged-in student
 * @route   GET /api/courses/my/enrolled
 * @access  Private
 */
export const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user.id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name email profileImage bio' },
    })
    .sort({ lastAccessedAt: -1 });

  return successResponse(res, 200, 'My enrolled courses retrieved', enrollments);
});

/**
 * @desc    Update lesson completion progress
 * @route   POST /api/courses/:id/progress
 * @access  Private
 */
export const updateCourseProgress = asyncHandler(async (req, res) => {
  const { lessonTitle, completed } = req.body;
  const courseId = req.params.id;
  const studentId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  let enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (!enrollment) {
    enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      completedLessons: [],
      completionPercentage: 0,
    });
  }

  // Calculate total lessons in course
  let totalLessons = 0;
  if (course.modules && course.modules.length > 0) {
    course.modules.forEach((mod) => {
      totalLessons += mod.lessons?.length || 0;
    });
  }
  if (totalLessons === 0) totalLessons = 1;

  const set = new Set(enrollment.completedLessons || []);
  if (completed) {
    if (lessonTitle) set.add(lessonTitle);
  } else {
    if (lessonTitle) set.delete(lessonTitle);
  }

  enrollment.completedLessons = Array.from(set);
  const percentage = Math.min(100, Math.round((enrollment.completedLessons.length / totalLessons) * 100));
  enrollment.completionPercentage = percentage;
  enrollment.lastAccessedLesson = lessonTitle || enrollment.lastAccessedLesson;
  enrollment.lastAccessedAt = new Date();

  if (percentage >= 100) {
    enrollment.status = 'completed';
    enrollment.completedAt = enrollment.completedAt || new Date();

    // Auto-generate certificate if not already issued
    if (!enrollment.certificateIssued) {
      const studentUser = await User.findById(studentId);
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const certId = `CERT-${course.category.substring(0, 3).toUpperCase()}-${randomSuffix}`;

      await Certificate.create({
        certificateId: certId,
        student: studentId,
        studentName: studentUser?.name || 'Verified Scholar',
        studentEmail: studentUser?.email || '',
        course: course._id,
        courseTitle: course.title,
        instructorName: course.instructorName || 'Faculty Lead',
        skillsCovered: course.learningOutcomes || [],
        issueDate: new Date(),
        grade: 'A+ with Distinction',
        verified: true,
      });

      enrollment.certificateIssued = true;
      enrollment.certificateId = certId;
    }
  }

  await enrollment.save();

  return successResponse(res, 200, 'Lesson progress updated', enrollment);
});

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Instructor, Admin)
 */
export const createCourse = asyncHandler(async (req, res) => {
  const courseData = {
    ...req.body,
    instructor: req.user.id,
    instructorName: req.user.name,
    published: req.user.role === 'admin' ? true : (req.body.published !== undefined ? req.body.published : true),
    status: req.user.role === 'admin' ? 'published' : (req.body.status || 'published'),
  };

  const course = await Course.create(courseData);
  return successResponse(res, 201, 'Course created successfully', course);
});

/**
 * @desc    Update an existing course
 * @route   PUT /api/courses/:id
 * @access  Private (Instructor, Admin)
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  // Ensure owner or admin
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
    return errorResponse(res, 403, 'Not authorized to update this course');
  }

  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return successResponse(res, 200, 'Course updated successfully', updatedCourse);
});

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private (Instructor, Admin)
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
    return errorResponse(res, 403, 'Not authorized to delete this course');
  }

  await Course.findByIdAndDelete(req.params.id);
  // Also remove enrollments associated with this course
  await Enrollment.deleteMany({ course: req.params.id });

  return successResponse(res, 200, 'Course deleted successfully');
});

/**
 * @desc    Change course publication status (Admin only)
 * @route   PUT /api/courses/:id/status
 * @access  Private (Admin)
 */
export const updateCourseStatus = asyncHandler(async (req, res) => {
  const { status, published } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  if (status) course.status = status;
  if (published !== undefined) course.published = published;
  await course.save();

  return successResponse(res, 200, 'Course status updated successfully', course);
});

/**
 * @desc    Add review & rating to course
 * @route   POST /api/courses/:id/reviews
 * @access  Private (Student)
 */
export const addCourseReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    return errorResponse(res, 400, 'Please provide a valid rating between 1 and 5');
  }

  course.reviews.push({
    student: req.user.id,
    studentName: req.user.name,
    rating: numRating,
    comment: comment || '',
    createdAt: new Date(),
  });

  // Recalculate average rating
  const total = course.reviews.reduce((acc, r) => acc + r.rating, 0);
  course.rating = Number((total / course.reviews.length).toFixed(1));
  course.ratingCount = course.reviews.length;

  await course.save();

  return successResponse(res, 201, 'Review submitted successfully', course.reviews);
});

/**
 * @desc    Post question in course Q&A discussion
 * @route   POST /api/courses/:id/questions
 * @access  Private
 */
export const addCourseQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question || !question.trim()) {
    return errorResponse(res, 400, 'Question text cannot be empty');
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  course.discussions.unshift({
    user: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    question: question.trim(),
    answers: [],
    createdAt: new Date(),
  });

  await course.save();

  return successResponse(res, 201, 'Question posted in course Q&A', course.discussions);
});

/**
 * @desc    Answer a course Q&A question
 * @route   POST /api/courses/:id/questions/:questionId/answers
 * @access  Private
 */
export const answerCourseQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer || !answer.trim()) {
    return errorResponse(res, 400, 'Answer text cannot be empty');
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  const discussion = course.discussions.id(req.params.questionId);
  if (!discussion) {
    return errorResponse(res, 404, 'Discussion question not found');
  }

  discussion.answers.push({
    user: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    answer: answer.trim(),
    createdAt: new Date(),
  });

  await course.save();

  return successResponse(res, 201, 'Answer posted to discussion', discussion);
});

/**
 * @desc    Add announcement to course (Instructor / Admin)
 * @route   POST /api/courses/:id/announcements
 * @access  Private (Instructor, Admin)
 */
export const addCourseAnnouncement = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return errorResponse(res, 400, 'Title and content are required for announcement');
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
    return errorResponse(res, 403, 'Only course instructor can post announcements');
  }

  course.announcements.unshift({
    title,
    content,
    authorName: req.user.name,
    createdAt: new Date(),
  });

  await course.save();

  return successResponse(res, 201, 'Announcement broadcasted to enrolled learners', course.announcements);
});
