import mongoose from 'mongoose';

const studyRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide room name'],
      trim: true,
      maxlength: [80, 'Room name cannot exceed 80 characters'],
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorName: {
      type: String,
      default: 'Student Leader',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxMembers: {
      type: Number,
      default: 12,
    },
    status: {
      type: String,
      enum: ['active', 'full', 'archived'],
      default: 'active',
    },
    courseCategory: {
      type: String,
      default: 'General Study',
    },
    tags: {
      type: [String],
      default: [],
    },
    currentGoal: {
      type: String,
      default: 'Collaborative problem solving and code review',
    },
  },
  {
    timestamps: true,
  }
);

const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);
export default StudyRoom;
