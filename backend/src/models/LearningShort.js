import mongoose from 'mongoose';

const learningShortSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide short title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide video stream URL'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Web Development',
    },
    duration: {
      type: Number,
      default: 45, // in seconds
    },
    tags: {
      type: [String],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    viewsCount: {
      type: Number,
      default: 0,
    },
    courseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    author: {
      type: String,
      default: 'LearnSphere Labs',
    },
  },
  {
    timestamps: true,
  }
);

const LearningShort = mongoose.model('LearningShort', learningShortSchema);
export default LearningShort;
