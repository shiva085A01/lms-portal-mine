import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      default: '',
    },
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    learned: {
      type: String,
      required: [true, 'Please share what you learned this week'],
    },
    difficulties: {
      type: String,
      default: '',
    },
    suggestions: {
      type: String,
      default: '',
    },
    confidenceLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High',
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
