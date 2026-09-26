import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
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
    courseTitle: {
      type: String,
      required: true,
    },
    assignmentId: {
      type: String,
      required: true,
    },
    assignmentTitle: {
      type: String,
      required: true,
    },
    codeOrText: {
      type: String,
      default: '',
    },
    submissionUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'graded', 'reviewed'],
      default: 'pending',
    },
    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    letterGrade: {
      type: String,
      default: '',
    },
    instructorFeedback: {
      type: String,
      default: '',
    },
    aiEvaluation: {
      score: Number,
      letterGrade: String,
      summary: String,
      rubricBreakdown: [
        {
          criterion: String,
          score: Number,
          maxScore: Number,
          comment: String,
        },
      ],
      strengths: [String],
      improvements: [String],
      suggestedRefactor: String,
      timeComplexity: String,
      spaceComplexity: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
      default: null,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
