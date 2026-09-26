import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
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
    instructorName: {
      type: String,
      default: 'Faculty Lead',
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      default: 'A - Honors',
    },
    skillsCovered: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
