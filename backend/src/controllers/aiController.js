import {
  evaluateSubmissionWithAI,
  askAITutor,
  generateQuizWithAI,
  analyzeResumeWithAI,
} from '../services/aiService.js';

/**
 * @desc   Evaluate code/assignment with AI rubric
 * @route  POST /api/ai/evaluate
 * @access Protected
 */
export const evaluateCode = async (req, res) => {
  try {
    const { taskPrompt, studentCode, rubric, language } = req.body;

    if (!studentCode || typeof studentCode !== 'string' || !studentCode.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Student code submission is required.',
      });
    }

    const evaluation = await evaluateSubmissionWithAI({
      taskPrompt,
      studentCode,
      rubric,
      language,
    });

    res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('AI Evaluation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process AI code evaluation.',
    });
  }
};

/**
 * @desc   Chat with 24/7 AI Tutor
 * @route  POST /api/ai/tutor-chat
 * @access Protected
 */
export const tutorChat = async (req, res) => {
  try {
    const { question, courseContext, chatHistory } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question prompt is required.',
      });
    }

    const reply = await askAITutor({
      question,
      courseContext,
      chatHistory,
    });

    res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error('AI Tutor Chat Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get response from AI tutor.',
    });
  }
};

/**
 * @desc   Generate dynamic AI quiz
 * @route  POST /api/ai/generate-quiz
 * @access Protected
 */
export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Quiz topic is required.',
      });
    }

    const quiz = await generateQuizWithAI({
      topic,
      difficulty,
      count: Number(count) || 5,
    });

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('AI Quiz Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate quiz with AI.',
    });
  }
};

/**
 * @desc   Analyze resume for ATS matching
 * @route  POST /api/ai/analyze-resume
 * @access Protected
 */
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required for analysis.',
      });
    }

    const analysis = await analyzeResumeWithAI({
      resumeText,
      targetRole,
    });

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('AI Resume Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume with AI.',
    });
  }
};
