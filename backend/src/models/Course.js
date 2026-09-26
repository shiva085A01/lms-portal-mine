import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  contentType: {
    type: String,
    enum: ['video', 'pdf', 'text', 'link'],
    default: 'video',
  },
  contentUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '10 min',
  },
  order: {
    type: Number,
    default: 1,
  },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 1,
  },
  lessons: [lessonSchema],
});

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,
    default: '',
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  timeLimitMinutes: {
    type: Number,
    default: 15,
  },
  questions: [quizQuestionSchema],
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  taskPrompt: {
    type: String,
    required: true,
  },
  rubric: {
    type: String,
    default: 'Functional correctness (40%), Clean code (30%), Complexity (30%)',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  points: {
    type: Number,
    default: 100,
  },
});

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    default: 'Course Instructor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const discussionAnswerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    default: 'student',
  },
  answer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const discussionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    default: 'student',
  },
  question: {
    type: String,
    required: true,
  },
  answers: [discussionAnswerSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    },
    category: {
      type: String,
      required: true,
      default: 'Full-Stack',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructorName: {
      type: String,
      default: 'Staff Instructor',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '8 weeks',
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'published',
    },
    published: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 1,
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    modules: [moduleSchema],
    quizzes: [quizSchema],
    assignments: [assignmentSchema],
    announcements: [announcementSchema],
    discussions: [discussionSchema],
    reviews: [reviewSchema],
    enrolledStudentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-create slug from title
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
