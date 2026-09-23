import mongoose from 'mongoose';

const careerResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['resume', 'interview', 'dsa', 'skill_roadmap', 'job_prep'],
    },
    description: {
      type: String,
      required: true,
    },
    resourceUrl: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Comprehensive'],
      default: 'Comprehensive',
    },
    companyTag: {
      type: String,
      default: 'Top Tech / FAANG',
    },
    readTime: {
      type: String,
      default: '15 min read',
    },
    checklist: [
      {
        item: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CareerResource = mongoose.model('CareerResource', careerResourceSchema);
export default CareerResource;
