import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Enrollment from '../src/models/Enrollment.js';
import Submission from '../src/models/Submission.js';
import QuizAttempt from '../src/models/QuizAttempt.js';
import Certificate from '../src/models/Certificate.js';
import LearningShort from '../src/models/LearningShort.js';
import StudyRoom from '../src/models/StudyRoom.js';
import Seminar from '../src/models/Seminar.js';
import CareerResource from '../src/models/CareerResource.js';
import Feedback from '../src/models/Feedback.js';
import Notification from '../src/models/Notification.js';

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  try {
    let connected = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`⏳ Attempting MongoDB connection (attempt ${attempt}/3)...`);
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          socketTimeoutMS: 30000,
        });
        connected = true;
        console.log('✅ Connected to MongoDB Atlas / Local for seeding...');
        break;
      } catch (connErr) {
        console.warn(`⚠️ Connection attempt ${attempt} failed: ${connErr.message}`);
        if (attempt === 3) throw connErr;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // Clean existing collections sequentially
    console.log('🧹 Purging previous collections...');
    for (const Model of [User, Course, Enrollment, Submission, QuizAttempt, Certificate, LearningShort, StudyRoom, Seminar, CareerResource, Feedback, Notification]) {
      await Model.deleteMany({});
    }

    console.log('🧹 Cleaned existing database collections.');

    // 1. Seed Users (Admin, Instructor, Students)
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@lms.com',
      password: 'Password@123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      bio: 'Platform Director and System Administrator for LearnSphere LMS.',
      skills: ['System Architecture', 'Cloud Infrastructure', 'Academic Pedagogy', 'Security & Governance'],
      interests: ['EdTech', 'AI Systems', 'Distributed Systems'],
      isActive: true,
    });

    const instructor = await User.create({
      name: 'Dr. Alan Turing',
      email: 'instructor@lms.com',
      password: 'Password@123',
      role: 'instructor',
      phone: '+1 (555) 481-9204',
      bio: 'Senior Software Architect and University Professor with 15+ years of engineering and curriculum design experience.',
      skills: ['Full-Stack MERN', 'Distributed Algorithms', 'System Design', 'Docker', 'AI Applications'],
      interests: ['Computer Science Education', 'Clean Code Architecture', 'Mentorship'],
      isActive: true,
    });

    const student = await User.create({
      name: 'Sarah Connor',
      email: 'student@lms.com',
      password: 'Password@123',
      role: 'student',
      phone: '+1 (555) 392-8172',
      bio: 'Undergraduate student and software engineering enthusiast specializing in full-stack web applications and algorithms.',
      skills: ['JavaScript (ES6+)', 'React 18', 'Node.js', 'Tailwind CSS', 'Python'],
      interests: ['Web Engineering', 'Competitive Programming', 'UI/UX Design'],
      isActive: true,
    });

    const student2 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@lms.com',
      password: 'Password@123',
      role: 'student',
      phone: '+1 (555) 829-1940',
      bio: 'Aspiring Cloud & DevOps engineer learning backend containerization and REST APIs.',
      skills: ['Docker', 'Linux', 'Node.js', 'MongoDB'],
      interests: ['Cloud Computing', 'Microservices'],
      isActive: true,
    });

    console.log('👤 Seeded Admin, Instructor, and Students.');

    // 2. Seed Real Comprehensive Courses with Modules, Lessons, Quizzes, Assignments, Announcements, Q&A, and Reviews
    const course1 = await Course.create({
      title: 'Full-Stack MERN Architecture: Zero to Production',
      slug: 'full-stack-mern-architecture-zero-to-production',
      description:
        'A comprehensive masterclass covering modern React 18, Node.js, Express, MongoDB Atlas, JWT authentication, state management, and real-world deployment pipelines.',
      thumbnail:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      category: 'Full-Stack',
      instructor: instructor._id,
      instructorName: instructor.name,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      price: 0,
      isFree: true,
      published: true,
      status: 'published',
      rating: 4.9,
      ratingCount: 85,
      enrolledStudentsCount: 2,
      learningOutcomes: [
        'Build scalable RESTful APIs with Node.js and Express',
        'Model complex schemas and relations in MongoDB with Mongoose',
        'Create rich responsive user interfaces in React 18 with Tailwind CSS',
        'Implement production-grade JWT authentication and role authorization',
        'Deploy production applications to cloud platforms with CI/CD',
      ],
      prerequisites: ['Basic JavaScript (ES6+)', 'Fundamental HTML and CSS'],
      modules: [
        {
          title: 'Module 1: Backend Foundation & REST Architecture',
          description: 'Setting up Node.js, Express, routers, and controller architecture',
          order: 1,
          lessons: [
            {
              title: 'Express REST Server Setup & Middleware Chain',
              description: 'Understanding express.json, CORS, Helmet, and error handlers',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration: '18 min',
              order: 1,
            },
            {
              title: 'MongoDB Atlas Integration & Mongoose Schemas',
              description: 'Connecting to MongoDB Atlas clusters and defining strict models',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              duration: '24 min',
              order: 2,
            },
            {
              title: 'JWT Authentication & Password Hashing',
              description: 'Bcrypt salt rounds, signed JWTs, and bearer header verification',
              contentType: 'text',
              contentUrl: 'https://jwt.io/introduction',
              duration: '15 min',
              order: 3,
            },
          ],
        },
        {
          title: 'Module 2: Modern Frontend with React & Tailwind',
          description: 'Component lifecycles, hooks, Axios interceptors, and glassmorphism styling',
          order: 2,
          lessons: [
            {
              title: 'React 18 State Architecture & Context API',
              description: 'Building custom hooks and centralizing authentication state',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              duration: '22 min',
              order: 1,
            },
            {
              title: 'Glassmorphism Design Systems with Tailwind CSS',
              description: 'Backdrop blur, translucent panels, and responsive grid layouts',
              contentType: 'text',
              contentUrl: 'https://tailwindcss.com/docs',
              duration: '20 min',
              order: 2,
            },
          ],
        },
      ],
      quizzes: [
        {
          title: 'MERN Stack Milestone 1 Knowledge Check',
          description: 'Test your understanding of Express middleware, MongoDB indexing, and JWT authentication flows.',
          timeLimitMinutes: 10,
          questions: [
            {
              question: 'Which middleware is essential in Express to parse incoming JSON payloads in request bodies?',
              options: ['express.urlencoded()', 'express.json()', 'express.static()', 'bodyCleaner()'],
              correctAnswerIndex: 1,
              explanation: 'express.json() is the built-in middleware function in Express that parses incoming requests with JSON payloads.',
            },
            {
              question: 'Where should JWT tokens typically be stored in secure browser Single Page Applications?',
              options: ['In plain global variables or HTTP-only cookies / secure memory', 'In URL query parameters', 'In HTML meta tags', 'In localStorage unencrypted with admin rights'],
              correctAnswerIndex: 0,
              explanation: 'Secure memory or HTTP-only cookies protect against XSS token exfiltration.',
            },
            {
              question: 'What is the purpose of Mongoose schema pre-save hooks in password hashing?',
              options: ['To hash the plain-text password with bcrypt before writing to the database', 'To send an email to the administrator', 'To restart the server', 'To delete duplicate records'],
              correctAnswerIndex: 0,
              explanation: 'Pre-save middleware intercepts user documents before writing to MongoDB, ensuring passwords are never stored in plaintext.',
            },
            {
              question: 'What does the HTTP 401 status code indicate in RESTful APIs?',
              options: ['Resource Not Found', 'Unauthorized / Missing Authentication Token', 'Server Internal Error', 'Successful Request'],
              correctAnswerIndex: 1,
              explanation: 'HTTP 401 Unauthorized indicates that the client request lacks valid authentication credentials.',
            },
          ],
        },
      ],
      assignments: [
        {
          title: 'Milestone 1: Resilient Authentication Middleware',
          description: 'Implement an Express auth middleware that extracts the Bearer token, verifies its signature with jsonwebtoken, and attaches req.user to subsequent handler routes.',
          taskPrompt: 'Write a Node.js Express middleware function `verifyToken(req, res, next)` that parses the Authorization header, validates the JWT, handles expired tokens gracefully, and attaches the decoded user object.',
          rubric: 'Token extraction & bearer check (30%), JWT verification & error handling (40%), req.user payload population (30%)',
          points: 100,
        },
        {
          title: 'Milestone 2: Custom React Hook for API Data Fetching with Caching',
          description: 'Build a reusable `useFetch(url)` hook in React with loading, data, and error state tracking, including cache invalidation.',
          taskPrompt: 'Create a production-grade custom React hook `useFetch(url, options)` that handles async Axios requests, abort controllers for component unmounting, and returns `{ data, loading, error, refetch }`.',
          rubric: 'Cleanup & AbortController (35%), Error boundary handling (35%), Clean TypeScript/JS code & documentation (30%)',
          points: 100,
        },
      ],
      announcements: [
        {
          title: 'Welcome to Full-Stack MERN Architecture!',
          content: 'Hello scholars! Our live Q&A office hours are held every Wednesday at 6 PM EST. Check the Course Q&A tab whenever you have architectural questions.',
          authorName: 'Dr. Alan Turing',
          createdAt: new Date(Date.now() - 86400000 * 5),
        },
        {
          title: 'Milestone 1 Assignment Rubric Released',
          content: 'The Milestone 1 assignment is now live. You can submit your code snippet directly in the Classroom tab for automated AI rubric evaluation and instructor remarks.',
          authorName: 'Dr. Alan Turing',
          createdAt: new Date(Date.now() - 86400000 * 2),
        },
      ],
      discussions: [
        {
          user: student._id,
          userName: 'Sarah Connor',
          userRole: 'student',
          question: 'Should we store JWT refresh tokens in Redis or directly in MongoDB with a TTL index?',
          createdAt: new Date(Date.now() - 86400000 * 3),
          answers: [
            {
              user: instructor._id,
              userName: 'Dr. Alan Turing',
              userRole: 'instructor',
              answer: 'Great question Sarah! In high-throughput production systems, Redis is preferred due to in-memory sub-millisecond lookups and native EXPIRE commands. For smaller systems, a MongoDB collection with a TTL index works reliably without extra infrastructure overhead.',
              createdAt: new Date(Date.now() - 86400000 * 2),
            },
          ],
        },
      ],
      reviews: [
        {
          student: student._id,
          studentName: 'Sarah Connor',
          rating: 5,
          comment: 'Outstanding curriculum! The step-by-step breakdown of Express middleware and JWT security answered every real-world question I had.',
          createdAt: new Date(Date.now() - 86400000 * 4),
        },
      ],
    });

    const course2 = await Course.create({
      title: 'Data Structures & Algorithms: FAANG Interview Blueprint',
      slug: 'data-structures-and-algorithms-faang-interview-blueprint',
      description:
        'Master core computer science algorithms: Two Pointers, Sliding Window, Trees, Graphs, Dynamic Programming, and System Design patterns for top-tier software roles.',
      thumbnail:
        'https://images.unsplash.com/photo-1516116211227-bbc13c79a25b?w=800&auto=format&fit=crop&q=80',
      category: 'Data Structures & Algorithms',
      instructor: instructor._id,
      instructorName: instructor.name,
      difficulty: 'Advanced',
      duration: '12 weeks',
      price: 0,
      isFree: true,
      published: true,
      status: 'published',
      rating: 4.95,
      ratingCount: 120,
      enrolledStudentsCount: 1,
      learningOutcomes: [
        'Analyze Big-O time and space complexities rigorously',
        'Solve tree traversal and graph search (BFS/DFS) challenges',
        'Implement dynamic programming with memoization and tabulation',
        'Ace technical coding rounds with structured pattern recognition',
      ],
      prerequisites: ['Proficiency in at least one programming language (JS, Python, Java, C++)'],
      modules: [
        {
          title: 'Module 1: Array & String Optimization Patterns',
          description: 'Two pointers, sliding window, and frequency maps',
          order: 1,
          lessons: [
            {
              title: 'Two Pointers & Binary Search in Practice',
              description: 'Shrinking search boundaries and optimal partition search',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              duration: '28 min',
              order: 1,
            },
          ],
        },
      ],
      quizzes: [
        {
          title: 'Algorithm Complexity & Two-Pointer Checkpoint',
          description: 'Evaluate time/space complexity analysis and pointer manipulation logic.',
          timeLimitMinutes: 12,
          questions: [
            {
              question: 'What is the time complexity of the Two-Pointer approach for finding a pair that sums to a target in a sorted array?',
              options: ['O(N^2)', 'O(N)', 'O(log N)', 'O(1)'],
              correctAnswerIndex: 1,
              explanation: 'Because each pointer moves at most N steps in a single pass, the time complexity is linear O(N).',
            },
          ],
        },
      ],
      assignments: [
        {
          title: 'Algorithm Lab: Trapping Rain Water Solution',
          description: 'Implement the optimal two-pointer solution for the classic Trapping Rain Water problem with O(N) time and O(1) auxiliary space.',
          taskPrompt: 'Write a JavaScript function `trap(height)` that calculates how much rain water can be trapped after raining given an array of non-negative integers.',
          rubric: 'O(N) time and O(1) space efficiency (50%), Correctness on edge cases (30%), Code readability (20%)',
          points: 100,
        },
      ],
    });

    const course3 = await Course.create({
      title: 'Applied Generative AI & LLM Application Development',
      slug: 'applied-generative-ai-and-llm-application-development',
      description:
        'Build production-ready AI agents, Retrieval-Augmented Generation (RAG) pipelines, prompt engineering workflows, and integrate Gemini/OpenAI models into web apps.',
      thumbnail:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      category: 'AI & Machine Learning',
      instructor: instructor._id,
      instructorName: instructor.name,
      difficulty: 'Intermediate',
      duration: '6 weeks',
      price: 0,
      isFree: true,
      published: true,
      status: 'published',
      rating: 4.88,
      ratingCount: 47,
      enrolledStudentsCount: 0,
      learningOutcomes: [
        'Understand tokenization, temperature, and top-p sampling in LLMs',
        'Build automated evaluation pipelines with structured JSON outputs',
        'Implement vector embeddings and semantic search',
      ],
      prerequisites: ['Basic Python or JavaScript knowledge'],
      modules: [
        {
          title: 'Module 1: LLM APIs & Structured Evaluation',
          description: 'Connecting to models and enforcing typed output schemas',
          order: 1,
          lessons: [
            {
              title: 'Prompt Engineering & Few-Shot Rubric Evaluation',
              description: 'Creating deterministic evaluators for academic grading',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              duration: '20 min',
              order: 1,
            },
          ],
        },
      ],
    });

    const course4 = await Course.create({
      title: 'Cloud DevOps & Container Orchestration with Docker & AWS',
      slug: 'cloud-devops-and-container-orchestration',
      description:
        'From local code to scalable cloud deployments. Containerize applications with Docker, configure multi-stage builds, and deploy on cloud infrastructure.',
      thumbnail:
        'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      category: 'Cloud & DevOps',
      instructor: instructor._id,
      instructorName: instructor.name,
      difficulty: 'All Levels',
      duration: '4 weeks',
      price: 0,
      isFree: true,
      published: true,
      status: 'published',
      rating: 4.79,
      ratingCount: 31,
      enrolledStudentsCount: 1,
      learningOutcomes: [
        'Write production Dockerfiles and docker-compose configurations',
        'Manage secrets and cloud environment variables securely',
        'Automate testing and deployment with CI/CD actions',
      ],
      prerequisites: ['Basic command line familiarity'],
      modules: [
        {
          title: 'Module 1: Docker Essentials',
          description: 'Images, layers, containers, and volume mounts',
          order: 1,
          lessons: [
            {
              title: 'Containerizing Node.js and React Applications',
              description: 'Multi-stage builds and optimizing image sizes',
              contentType: 'video',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
              duration: '16 min',
              order: 1,
            },
          ],
        },
      ],
    });

    console.log('📚 Seeded 4 Comprehensive Courses with rich curriculums.');

    // 3. Seed Enrollments
    const enrollment1 = await Enrollment.create({
      student: student._id,
      course: course1._id,
      completionPercentage: 100,
      completedLessons: [
        'Express REST Server Setup & Middleware Chain',
        'MongoDB Atlas Integration & Mongoose Schemas',
        'JWT Authentication & Password Hashing',
        'React 18 State Architecture & Context API',
        'Glassmorphism Design Systems with Tailwind CSS',
      ],
      lastAccessedLesson: 'Glassmorphism Design Systems with Tailwind CSS',
      status: 'completed',
      certificateIssued: true,
      certificateId: 'CERT-FUL-891042',
      completedAt: new Date(Date.now() - 86400000 * 2),
    });

    await Enrollment.create({
      student: student._id,
      course: course2._id,
      completionPercentage: 50,
      completedLessons: ['Two Pointers & Binary Search in Practice'],
      lastAccessedLesson: 'Two Pointers & Binary Search in Practice',
      status: 'active',
    });

    await Enrollment.create({
      student: student2._id,
      course: course1._id,
      completionPercentage: 40,
      completedLessons: ['Express REST Server Setup & Middleware Chain', 'MongoDB Atlas Integration & Mongoose Schemas'],
      lastAccessedLesson: 'JWT Authentication & Password Hashing',
      status: 'active',
    });

    await Enrollment.create({
      student: student2._id,
      course: course4._id,
      completionPercentage: 100,
      completedLessons: ['Containerizing Node.js and React Applications'],
      lastAccessedLesson: 'Containerizing Node.js and React Applications',
      status: 'completed',
      certificateIssued: true,
      certificateId: 'CERT-CLO-994120',
      completedAt: new Date(Date.now() - 86400000 * 1),
    });

    console.log('📝 Seeded real student enrollments and course completions.');

    // 4. Seed Verified Certificates
    await Certificate.create([
      {
        certificateId: 'CERT-FUL-891042',
        student: student._id,
        studentName: student.name,
        studentEmail: student.email,
        course: course1._id,
        courseTitle: course1.title,
        instructorName: instructor.name,
        issueDate: new Date(Date.now() - 86400000 * 2),
        grade: 'A+ with Highest Distinction',
        skillsCovered: course1.learningOutcomes,
        verified: true,
      },
      {
        certificateId: 'CERT-CLO-994120',
        student: student2._id,
        studentName: student2.name,
        studentEmail: student2.email,
        course: course4._id,
        courseTitle: course4.title,
        instructorName: instructor.name,
        issueDate: new Date(Date.now() - 86400000 * 1),
        grade: 'A First Class',
        skillsCovered: course4.learningOutcomes,
        verified: true,
      },
    ]);

    console.log('🎓 Seeded authentic verified Certificates of Completion.');

    // 5. Seed Real Assignment Submissions
    const sub1 = await Submission.create({
      student: student._id,
      studentName: student.name,
      course: course1._id,
      courseTitle: course1.title,
      assignmentId: course1.assignments[0]._id.toString(),
      assignmentTitle: course1.assignments[0].title,
      codeOrText: `import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(403).json({ success: false, message: 'Invalid or forged authentication token' });
  }
};`,
      submissionUrl: 'https://github.com/sarahconnor/mern-auth-middleware',
      notes: 'Included explicit handling for TokenExpiredError and standard bearer token isolation.',
      status: 'graded',
      score: 96,
      letterGrade: 'A+',
      instructorFeedback: 'Flawless middleware implementation Sarah! Clean separation of 401 unauthorized vs 403 forbidden and clear error responses.',
      aiEvaluation: {
        score: 96,
        letterGrade: 'A+',
        summary: 'Exemplary Bearer header parsing with robust TokenExpiredError detection and clean error responses.',
        rubricBreakdown: [
          { criterion: 'Token Extraction', score: 30, maxScore: 30, comment: 'Strict Bearer prefix validation' },
          { criterion: 'JWT Verification', score: 38, maxScore: 40, comment: 'Differentiates expired vs forged tokens' },
          { criterion: 'Payload Population', score: 28, maxScore: 30, comment: 'Attaches decoded user smoothly to req.user' },
        ],
        strengths: ['Handles TokenExpiredError specifically', 'Clean guard clauses'],
        improvements: ['Consider validating that decoded user contains expected schema fields'],
        suggestedRefactor: 'export const verifyToken = async (req, res, next) => { ... }',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
      },
      submittedAt: new Date(Date.now() - 86400000 * 2),
      gradedAt: new Date(Date.now() - 86400000 * 1),
      gradedBy: instructor._id,
    });

    const sub2 = await Submission.create({
      student: student2._id,
      studentName: student2.name,
      course: course1._id,
      courseTitle: course1.title,
      assignmentId: course1.assignments[0]._id.toString(),
      assignmentTitle: course1.assignments[0].title,
      codeOrText: `const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}
module.exports = authMiddleware;`,
      submissionUrl: 'https://github.com/alexrivera/jwt-checker',
      notes: 'Initial attempt at auth middleware for review.',
      status: 'pending',
      score: null,
      letterGrade: '',
      submittedAt: new Date(Date.now() - 3600000 * 4),
    });

    console.log('📤 Seeded real assignment submissions.');

    // 6. Seed Quiz Attempts
    await QuizAttempt.create([
      {
        student: student._id,
        studentName: student.name,
        course: course1._id,
        quizId: course1.quizzes[0]._id.toString(),
        quizTitle: course1.quizzes[0].title,
        score: 100,
        totalQuestions: 4,
        correctAnswersCount: 4,
        passed: true,
        answers: [
          { questionIndex: 0, questionText: 'Which middleware is essential...', selectedOptionIndex: 1, correctOptionIndex: 1, isCorrect: true },
          { questionIndex: 1, questionText: 'Where should JWT tokens typically...', selectedOptionIndex: 0, correctOptionIndex: 0, isCorrect: true },
          { questionIndex: 2, questionText: 'What is the purpose of Mongoose...', selectedOptionIndex: 0, correctOptionIndex: 0, isCorrect: true },
          { questionIndex: 3, questionText: 'What does the HTTP 401 status...', selectedOptionIndex: 1, correctOptionIndex: 1, isCorrect: true },
        ],
        completedAt: new Date(Date.now() - 86400000 * 3),
      },
    ]);

    console.log('📊 Seeded real quiz attempt records.');

    // 7. Seed Learning Shorts
    await LearningShort.create([
      {
        title: 'JavaScript Closures Explained in 30 Seconds',
        description: 'Understand lexical scoping and how inner functions retain access to outer variables even after execution.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60',
        topic: 'JavaScript Fundamentals',
        category: 'Frontend',
        duration: 35,
        tags: ['javascript', 'closures', 'webdev', 'frontend'],
        likesCount: 142,
        viewsCount: 1280,
        courseRef: course1._id,
        author: 'Dr. Alan Turing',
      },
      {
        title: 'CSS Grid vs Flexbox: The Golden Rule',
        description: 'Use Flexbox for 1D content alignment (rows or columns). Use Grid for 2D structured page layouts and galleries.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60',
        topic: 'CSS Mastery',
        category: 'Frontend',
        duration: 42,
        tags: ['css', 'grid', 'flexbox', 'ui-design'],
        likesCount: 230,
        viewsCount: 2450,
        courseRef: course1._id,
        author: 'Sarah Connor',
      },
      {
        title: 'How Git Rebase Actually Rewrites History',
        description: 'Visual demonstration of how git rebase moves the entire feature branch onto the tip of the main branch for a linear commit history.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&auto=format&fit=crop&q=60',
        topic: 'DevOps & Git',
        category: 'Cloud & DevOps',
        duration: 50,
        tags: ['git', 'versioncontrol', 'devops', 'productivity'],
        likesCount: 98,
        viewsCount: 910,
        courseRef: course4._id,
        author: 'System Administrator',
      },
      {
        title: 'Mastering the Sliding Window Algorithm',
        description: 'Learn how to transform O(N^2) nested loops into efficient O(N) linear time using dynamic window pointers.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60',
        topic: 'Algorithms & LeetCode',
        category: 'Data Structures & Algorithms',
        duration: 45,
        tags: ['dsa', 'algorithms', 'leetcode', 'interviews'],
        likesCount: 312,
        viewsCount: 3890,
        courseRef: course2._id,
        author: 'Dr. Alan Turing',
      },
      {
        title: 'Why React useEffect Dependencies Matter',
        description: 'Prevent infinite re-render loops and stale closures by managing the dependency array and utilizing cleanup functions correctly.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60',
        topic: 'React Hooks',
        category: 'Frontend',
        duration: 38,
        tags: ['react', 'hooks', 'useeffect', 'javascript'],
        likesCount: 184,
        viewsCount: 1720,
        courseRef: course1._id,
        author: 'Sarah Connor',
      },
    ]);

    // 8. Seed Study Rooms
    await StudyRoom.create([
      {
        name: 'React 18 & Frontend Architecture Hub',
        topic: 'Advanced React patterns, state management, and Tailwind design systems',
        description: 'A study group focused on reviewing pull requests, solving UI bugs, and building production-grade web applications together.',
        courseCategory: 'Frontend',
        maxMembers: 12,
        creator: student._id,
        creatorName: student.name,
        members: [student._id, instructor._id],
        currentGoal: 'Building reusable glassmorphic components and hooks',
        tags: ['React', 'Tailwind', 'Vite', 'Frontend'],
        status: 'active',
      },
      {
        name: 'LeetCode Daily Grinders & Algorithm Lab',
        topic: 'Solving Medium and Hard problems from NeetCode 150',
        description: 'Daily meetups at 7 PM to live-code problem solutions, discuss time complexities, and conduct mock interviews.',
        courseCategory: 'Data Structures & Algorithms',
        maxMembers: 10,
        creator: instructor._id,
        creatorName: instructor.name,
        members: [instructor._id, student._id],
        currentGoal: 'Mastering Graph Traversal (Dijkstra, Topological Sort)',
        tags: ['LeetCode', 'DSA', 'Algorithms', 'FAANG'],
        status: 'active',
      },
      {
        name: 'Full-Stack MERN Capstone Incubator',
        topic: 'End-to-end full-stack portal projects with Express and MongoDB Atlas',
        description: 'Collaborate with peers on architectural design, schema modeling, and production deployment on cloud services.',
        courseCategory: 'Full-Stack',
        maxMembers: 8,
        creator: admin._id,
        creatorName: admin.name,
        members: [admin._id],
        currentGoal: 'REST API security audits and JWT authorization flows',
        tags: ['NodeJS', 'Express', 'MongoDB', 'Cloudinary'],
        status: 'active',
      },
    ]);

    // 9. Seed Seminars
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 11);

    await Seminar.create([
      {
        title: 'Architecting Scalable Microservices with Node.js & Docker',
        description: 'Join industry architect David Vance for an in-depth breakdown of message brokers, containerization, distributed caching, and zero-downtime deployment pipelines.',
        speaker: {
          name: 'David Vance',
          role: 'Principal Cloud Architect',
          company: 'CloudScale Systems',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        },
        date: nextWeek,
        time: '06:00 PM EST',
        duration: '90 mins',
        meetingLink: 'https://meet.google.com/lms-microservices-live',
        thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        category: 'Cloud & System Design',
        registrations: [student._id],
        status: 'upcoming',
        keyTakeaways: [
          'Deconstructing monolithic backends into cohesive services',
          'Implementing idempotent APIs with Redis caching',
          'Multi-stage Docker builds and Kubernetes ingress',
        ],
      },
      {
        title: 'Cracking the FAANG Technical & System Design Rounds',
        description: 'A tactical masterclass on behavioral frameworks, coding communication strategies, and whiteboarding system design problems under pressure.',
        speaker: {
          name: 'Priya Sharma',
          role: 'Senior Staff Engineer',
          company: 'Meta',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        },
        date: twoWeeks,
        time: '05:30 PM EST',
        duration: '75 mins',
        meetingLink: 'https://meet.google.com/lms-faang-prep-live',
        thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
        category: 'Career & Placement',
        registrations: [student._id, student2._id],
        status: 'upcoming',
        keyTakeaways: [
          'Structured problem-solving template for 45-minute coding rounds',
          'Navigating trade-offs: CAP theorem, SQL vs NoSQL, caching layers',
          'Handling salary negotiation and multi-offer leverage',
        ],
      },
    ]);

    // 10. Seed Career Resources
    await CareerResource.create([
      {
        title: 'Full-Stack Software Engineer Resume Blueprint (ATS-Optimized)',
        category: 'resume',
        description: 'Complete guide and interactive checklist for engineering resumes that bypass automated filters and grab hiring manager attention.',
        skills: ['Resume Formatting', 'Action Verbs', 'Quantifiable Metrics', 'Project Highlights'],
        difficulty: 'Comprehensive',
        companyTag: 'Google, Amazon, Stripe',
        readTime: '12 min read',
        checklist: [
          { item: 'Single-page concise layout with clean font hierarchy', description: 'Ensure readability on mobile and desktop screens.' },
          { item: 'XYZ Formula for work bullets', description: 'Accomplished [X] as measured by [Y], by doing [Z].' },
          { item: 'Live production URL and GitHub repo link for each project', description: 'Reviewers test real deployed links.' },
          { item: 'Tailored skills section without self-rating bars', description: 'List concrete technologies, not subjective percentages.' },
        ],
      },
      {
        title: 'Top 75 LeetCode Patterns: Essential Problem-Solving Framework',
        category: 'dsa',
        description: 'The definitive algorithmic roadmap organized by pattern: Two Pointers, Fast & Slow Pointers, Sliding Window, Monotonic Stack, Backtracking, and Graphs.',
        skills: ['Binary Search', 'Sliding Window', 'Dynamic Programming', 'Graph Search'],
        difficulty: 'Advanced',
        companyTag: 'FAANG / Tier-1',
        readTime: '25 min read',
        checklist: [
          { item: 'Pattern 1: Two Pointers for sorted arrays and palindrome checks', description: 'Reduces quadratic loops to O(N).' },
          { item: 'Pattern 2: Sliding Window for contiguous subarray calculations', description: 'Maintains window state dynamically.' },
          { item: 'Pattern 3: Fast & Slow Pointers for cycle detection', description: 'Floyd cycle-finding algorithm.' },
          { item: 'Pattern 4: Depth-First Search for trees and connected components', description: 'Recursive and stack-based traversals.' },
        ],
      },
      {
        title: 'System Design Primer: From 100 to 1,000,000 Concurrent Users',
        category: 'interview',
        description: 'A structured breakdown of load balancers, database sharding, replication, CDN edge caching, and distributed locking mechanisms.',
        skills: ['Horizontal Scaling', 'Load Balancing', 'Redis Caching', 'Database Sharding'],
        difficulty: 'Intermediate',
        companyTag: 'Uber, Netflix, Airbnb',
        readTime: '20 min read',
        checklist: [
          { item: 'Step 1: Clarify functional and non-functional requirements', description: 'Establish read/write ratios and latency SLAs.' },
          { item: 'Step 2: High-level architectural diagram', description: 'Client -> CDN -> API Gateway -> App Servers -> DB.' },
          { item: 'Step 3: Database schema and storage estimation', description: 'Calculate daily queries, storage bytes, and bandwidth.' },
          { item: 'Step 4: Bottleneck identification and resolution', description: 'Address single points of failure with redundancy.' },
        ],
      },
      {
        title: 'Full-Stack Web Engineering Career Roadmap (2026 Edition)',
        category: 'skill_roadmap',
        description: 'Step-by-step technological milestone progression from modern TypeScript, React Server Components, and REST/GraphQL to Cloud DevOps.',
        skills: ['TypeScript', 'Next.js / Vite', 'Node.js', 'PostgreSQL / MongoDB', 'Docker'],
        difficulty: 'Comprehensive',
        companyTag: 'Modern Tech SaaS',
        readTime: '15 min read',
        checklist: [
          { item: 'Milestone 1: Modern JavaScript ES6+ & TypeScript Essentials', description: 'Async/await, closures, interfaces, and generics.' },
          { item: 'Milestone 2: Production React Architecture', description: 'Custom hooks, query caching, and component modularity.' },
          { item: 'Milestone 3: Resilient Backend Engineering', description: 'Rate limiting, validation, authentication, and database indexes.' },
          { item: 'Milestone 4: Cloud Deployment & CI/CD Pipelines', description: 'Docker containerization and automated testing suites.' },
        ],
      },
    ]);

    // 11. Seed Feedback
    await Feedback.create([
      {
        student: student._id,
        studentName: student.name,
        weekNumber: 1,
        rating: 5,
        learned: 'Successfully mastered Express middleware pipelines, JWT bearer authentication, and Mongoose schema validation.',
        difficulties: 'Understanding asynchronous error propagation in Express without crashing the process.',
        suggestions: 'Would love more interactive quizzes on security headers and CSRF tokens.',
        confidenceLevel: 'High',
      },
      {
        student: student2._id,
        studentName: student2.name,
        weekNumber: 1,
        rating: 4,
        learned: 'Learned Docker multi-stage builds and container networking for Express backends.',
        difficulties: 'Configuring volume mounts for persistent data across container restarts.',
        suggestions: 'More real-world docker-compose orchestration examples.',
        confidenceLevel: 'Medium',
      },
    ]);

    // 12. Seed Notifications
    await Notification.create([
      {
        user: student._id,
        title: 'Course Completed & Certificate Awarded! 🎓',
        message: 'Congratulations! You completed "Full-Stack MERN Architecture: Zero to Production" with distinction. Your verified certificate CERT-FUL-891042 is available.',
        type: 'achievement',
        link: '/student/certificates',
        read: false,
      },
      {
        user: student._id,
        title: 'Assignment Graded by Instructor 📝',
        message: 'Dr. Alan Turing graded your Milestone 1 submission with a score of 96/100 (A+).',
        type: 'course',
        link: '/student/courses',
        read: false,
      },
      {
        user: instructor._id,
        title: 'New Student Submission Pending Grade 📥',
        message: 'Alex Rivera submitted Milestone 1 in "Full-Stack MERN Architecture". Click to evaluate with AI.',
        type: 'course',
        link: '/instructor/grading',
        read: false,
      },
      {
        user: admin._id,
        title: 'Platform Telemetry Online 🛡️',
        message: 'Database clusters healthy, active student enrollments updated, all services operational.',
        type: 'system',
        link: '/admin/dashboard',
        read: false,
      },
    ]);

    console.log('\n======================================================');
    console.log('🎉 REAL PRODUCTION-GRADE LMS DATABASE SEEDED!');
    console.log('------------------------------------------------------');
    console.log('👑 Admin:      admin@lms.com      / Password@123');
    console.log('👨‍🏫 Instructor: instructor@lms.com / Password@123');
    console.log('👩‍🎓 Student:    student@lms.com    / Password@123');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
