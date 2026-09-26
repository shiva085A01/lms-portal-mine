import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Google & Cloudflare DNS resolvers are used for MongoDB SRV TXT lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if not permitted
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables (.env).');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`\n======================================================`);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please verify your MONGODB_URI in backend/.env');
    console.error('Ensure network access (IP whitelist) is configured in MongoDB Atlas.\n');
    throw error;
  }
};
