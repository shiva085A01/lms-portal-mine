import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { successResponse } from './utils/apiResponse.js';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import learningShortRoutes from './routes/learningShortRoutes.js';
import studyRoomRoutes from './routes/studyRoomRoutes.js';
import seminarRoutes from './routes/seminarRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS setup
const frontendUrl = (process.env.FRONTEND_URL || '').trim().replace(/\/+$/, '');
const allowedOrigins = [
  frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, Postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      // Allow configured origins, subdomains/previews on Vercel, Netlify, Render, or in dev mode
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app') ||
        normalizedOrigin.endsWith('.netlify.app') ||
        normalizedOrigin.endsWith('.onrender.com') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback: allow request to proceed cleanly
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  return successResponse(res, 200, 'LearnSphere LMS API is healthy and running', {
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LearnSphere Full-Stack LMS API',
    documentation: '/api/health',
    version: '1.0.0',
  });
});

// Mount All Feature API Routes (both with /api prefix and direct fallback)
const routeList = [
  ['/auth', authRoutes],
  ['/users', userRoutes],
  ['/courses', courseRoutes],
  ['/learning-shorts', learningShortRoutes],
  ['/study-rooms', studyRoomRoutes],
  ['/seminars', seminarRoutes],
  ['/career', careerRoutes],
  ['/feedback', feedbackRoutes],
  ['/notifications', notificationRoutes],
  ['/analytics', analyticsRoutes],
  ['/ai', aiRoutes],
];

routeList.forEach(([path, router]) => {
  app.use(`/api${path}`, router);
  app.use(path, router);
});
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/modules', moduleRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/assignments', assignmentRoutes);
// app.use('/api/submissions', submissionRoutes);
// app.use('/api/quizzes', quizRoutes);
// app.use('/api/quiz-attempts', quizAttemptRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/study-rooms', studyRoomRoutes);
// app.use('/api/seminars', seminarRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/career', careerRoutes);
// app.use('/api/learning-shorts', learningShortRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/analytics', analyticsRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
