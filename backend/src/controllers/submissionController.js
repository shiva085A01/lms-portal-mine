import Submission from '../models/Submission.js';
import Course from '../models/Course.js';
import { evaluateSubmissionWithAI } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Submit an assignment
 * @route   POST /api/submissions
 * @access  Private (Student, Instructor, Admin)
 */
export const submitAssignment = asyncHandler(async (req, res) => {
  const { courseId, assignmentId, assignmentTitle, codeOrText, submissionUrl, notes, autoEvaluate } = req.body;

  if (!courseId || !assignmentId || !assignmentTitle) {
    return errorResponse(res, 400, 'Course ID, Assignment ID, and Assignment Title are required.');
  }

  if (!codeOrText && !submissionUrl && !notes) {
    return errorResponse(res, 400, 'Please provide code submission, repository URL, or solution text.');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return errorResponse(res, 404, 'Course not found');
  }

  // Find assignment rubric if available
  const assignment = course.assignments?.find((a) => a._id?.toString() === assignmentId || a.title === assignmentTitle);
  const rubric = assignment?.rubric || 'Correctness (40%), Code Quality (30%), Optimization (30%)';
  const taskPrompt = assignment?.taskPrompt || assignment?.description || assignmentTitle;

  let aiEvaluation = null;
  let score = null;
  let letterGrade = '';

  // Run AI evaluation if requested or if code is present
  if (autoEvaluate && codeOrText && codeOrText.trim().length > 10) {
    try {
      aiEvaluation = await evaluateSubmissionWithAI({
        taskPrompt,
        studentCode: codeOrText,
        rubric,
        language: 'javascript',
      });
      if (aiEvaluation?.score) {
        score = aiEvaluation.score;
        letterGrade = aiEvaluation.letterGrade || (score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D');
      }
    } catch (aiErr) {
      console.warn('Auto AI evaluation skipped or failed:', aiErr.message);
    }
  }

  // Check if existing submission for this assignment by this student
  let submission = await Submission.findOne({
    student: req.user.id,
    course: courseId,
    assignmentId: assignmentId,
  });

  if (submission) {
    submission.codeOrText = codeOrText || submission.codeOrText;
    submission.submissionUrl = submissionUrl || submission.submissionUrl;
    submission.notes = notes || submission.notes;
    submission.submittedAt = new Date();
    if (aiEvaluation) {
      submission.aiEvaluation = aiEvaluation;
      submission.score = score;
      submission.letterGrade = letterGrade;
      submission.status = 'reviewed';
    }
    await submission.save();
    return successResponse(res, 200, 'Assignment resubmitted successfully', submission);
  }

  submission = await Submission.create({
    student: req.user.id,
    studentName: req.user.name,
    course: courseId,
    courseTitle: course.title,
    assignmentId,
    assignmentTitle,
    codeOrText: codeOrText || '',
    submissionUrl: submissionUrl || '',
    notes: notes || '',
    aiEvaluation,
    score,
    letterGrade,
    status: aiEvaluation ? 'reviewed' : 'pending',
    submittedAt: new Date(),
  });

  return successResponse(res, 201, 'Assignment submitted successfully!', submission);
});

/**
 * @desc    Get student's own submissions
 * @route   GET /api/submissions/my
 * @access  Private
 */
export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ student: req.user.id })
    .populate('course', 'title category thumbnail')
    .sort({ submittedAt: -1 });

  return successResponse(res, 200, 'My submissions retrieved', submissions);
});

/**
 * @desc    Get submissions for instructor's courses
 * @route   GET /api/submissions/instructor
 * @access  Private (Instructor, Admin)
 */
export const getInstructorSubmissions = asyncHandler(async (req, res) => {
  let courseIds = [];
  if (req.user.role === 'admin') {
    const courses = await Course.find().select('_id');
    courseIds = courses.map((c) => c._id);
  } else {
    const courses = await Course.find({ instructor: req.user.id }).select('_id');
    courseIds = courses.map((c) => c._id);
  }

  const submissions = await Submission.find({ course: { $in: courseIds } })
    .populate('student', 'name email profileImage')
    .populate('course', 'title category thumbnail')
    .sort({ submittedAt: -1 });

  return successResponse(res, 200, 'Instructor submissions retrieved', submissions);
});

/**
 * @desc    Grade a student submission (Instructor / Admin)
 * @route   PUT /api/submissions/:id/grade
 * @access  Private (Instructor, Admin)
 */
export const gradeSubmission = asyncHandler(async (req, res) => {
  const { score, letterGrade, instructorFeedback, runAIEvaluation } = req.body;
  const submission = await Submission.findById(req.params.id).populate('course');

  if (!submission) {
    return errorResponse(res, 404, 'Submission not found');
  }

  if (runAIEvaluation && submission.codeOrText) {
    try {
      const evaluation = await evaluateSubmissionWithAI({
        taskPrompt: submission.assignmentTitle,
        studentCode: submission.codeOrText,
        rubric: 'Functional correctness (40%), Code Quality (30%), Optimization (30%)',
        language: 'javascript',
      });
      submission.aiEvaluation = evaluation;
      if (!score && evaluation.score) {
        submission.score = evaluation.score;
        submission.letterGrade = evaluation.letterGrade;
      }
    } catch (err) {
      console.warn('Manual trigger of AI grading failed:', err.message);
    }
  }

  if (score !== undefined && score !== null) {
    submission.score = Number(score);
  }
  if (letterGrade) {
    submission.letterGrade = letterGrade;
  }
  if (instructorFeedback !== undefined) {
    submission.instructorFeedback = instructorFeedback;
  }

  submission.status = 'graded';
  submission.gradedAt = new Date();
  submission.gradedBy = req.user.id;

  await submission.save();

  return successResponse(res, 200, 'Submission graded and published to student!', submission);
});
