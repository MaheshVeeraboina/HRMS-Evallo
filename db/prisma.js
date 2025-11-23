import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a singleton PrismaClient instance
// This ensures environment variables are loaded before PrismaClient is created
let prisma;

if (process.env.DATABASE_URL) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} else {
  console.error('\n❌ ERROR: DATABASE_URL environment variable is not set!\n');
  console.error('📝 Please create a .env file in the backend directory.');
  console.error(`   Expected location: ${join(__dirname, '..', '.env')}\n`);
  console.error('📋 The .env file should contain:');
  console.error('   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms?schema=public"');
  console.error('   JWT_SECRET=your-super-secret-jwt-key');
  console.error('   JWT_EXPIRES_IN=7d');
  console.error('   PORT=5000');
  console.error('   NODE_ENV=development\n');
  console.error('💡 Quick fix: Run this PowerShell command from the backend directory:');
  console.error('   @\'');
  console.error('   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms?schema=public"');
  console.error('   JWT_SECRET=your-super-secret-jwt-key');
  console.error('   JWT_EXPIRES_IN=7d');
  console.error('   PORT=5000');
  console.error('   NODE_ENV=development');
  console.error('   \'@ | Out-File -FilePath .env -Encoding utf8\n');
  // Create a dummy instance to prevent crashes, but it won't work
  prisma = new PrismaClient();
}

export default prisma;

