import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
    quizTitle: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswersCount: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    answers: [
      {
        questionIndex: Number,
        questionText: String,
        selectedOptionIndex: Number,
        correctOptionIndex: Number,
        isCorrect: Boolean,
      },
    ],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
