import QuizAttempt from '../models/QuizAttempt.js';
import Course from '../models/Course.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Submit answers for a course quiz
 * @route   POST /api/quizzes/submit
 * @access  Private
 */
export const submitQuiz = asyncHandler(async (req, res) => {
  const { courseId, quizId, quizTitle, userAnswers } = req.body;

  if (!courseId || !quizId || !Array.isArray(userAnswers)) {
    return errorResponse(res, 400, 'Course ID, Quiz ID, and user answers array are required.');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  const quiz = course.quizzes?.find((q) => q._id?.toString() === quizId || q.title === quizTitle);
  if (!quiz) {
    return errorResponse(res, 404, 'Quiz not found in this course');
  }

  // Calculate score and accuracy
  let correctCount = 0;
  const gradedAnswers = quiz.questions.map((q, idx) => {
    const selected = userAnswers[idx];
    const isCorrect = selected === q.correctAnswerIndex;
    if (isCorrect) correctCount++;
    return {
      questionIndex: idx,
      questionText: q.question,
      selectedOptionIndex: selected,
      correctOptionIndex: q.correctAnswerIndex,
      isCorrect,
    };
  });

  const totalQuestions = quiz.questions.length || 1;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 70;

  const attempt = await QuizAttempt.create({
    student: req.user.id,
    studentName: req.user.name,
    course: courseId,
    quizId,
    quizTitle: quiz.title,
    score,
    totalQuestions,
    correctAnswersCount: correctCount,
    passed,
    answers: gradedAnswers,
    completedAt: new Date(),
  });

  return successResponse(res, 201, `Quiz evaluated! You scored ${score}% (${correctCount}/${totalQuestions})`, attempt);
});

/**
 * @desc    Get student's quiz history
 * @route   GET /api/quizzes/my-attempts
 * @access  Private
 */
export const getMyQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ student: req.user.id })
    .populate('course', 'title category thumbnail')
    .sort({ completedAt: -1 });

  return successResponse(res, 200, 'Quiz attempts history retrieved', attempts);
});

/**
 * @desc    Get quiz attempts for instructor's courses
 * @route   GET /api/quizzes/instructor
 * @access  Private (Instructor, Admin)
 */
export const getInstructorQuizAttempts = asyncHandler(async (req, res) => {
  let courseIds = [];
  if (req.user.role === 'admin') {
    const courses = await Course.find().select('_id');
    courseIds = courses.map((c) => c._id);
  } else {
    const courses = await Course.find({ instructor: req.user.id }).select('_id');
    courseIds = courses.map((c) => c._id);
  }

  const attempts = await QuizAttempt.find({ course: { $in: courseIds } })
    .populate('student', 'name email profileImage')
    .populate('course', 'title category')
    .sort({ completedAt: -1 });

  return successResponse(res, 200, 'Instructor quiz attempts retrieved', attempts);
});
