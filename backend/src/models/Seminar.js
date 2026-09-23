import mongoose from 'mongoose';

const seminarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide seminar title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    speaker: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      company: { type: String, default: 'Tech Industry' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      default: '06:00 PM EST',
    },
    duration: {
      type: String,
      default: '90 mins',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/xyz-edtech-session',
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    },
    category: {
      type: String,
      default: 'Career & Industry',
    },
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed'],
      default: 'upcoming',
    },
    keyTakeaways: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Seminar = mongoose.model('Seminar', seminarSchema);
export default Seminar;
