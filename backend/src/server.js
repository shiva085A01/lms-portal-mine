import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt DB connection
    try {
      await connectDB();
    } catch (dbErr) {
      console.warn('⚠️  Database connection could not be established immediately.');
      console.warn('   Ensure MongoDB Atlas URI is set in backend/.env');
      console.warn('   Server will start so health endpoints & initial setup can be validated.\n');
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 LearnSphere LMS Server listening on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`💥 Unhandled Rejection: ${err.message}`);
      // server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(`💥 Uncaught Exception: ${err.message}`);
      // process.exit(1);
    });
  } catch (error) {
    console.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
