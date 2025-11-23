// Simple script to create the database using Node.js
// Run: node create-db-simple.js

import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'postgres' // Connect to default postgres database first
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'hrms'"
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Database "hrms" already exists!');
    } else {
      // Create database
      await client.query('CREATE DATABASE hrms');
      console.log('✅ Database "hrms" created successfully!');
    }

    await client.end();
    
    console.log('');
    console.log('Next step: Run migrations');
    console.log('  npm run prisma:migrate');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Make sure:');
    console.error('  1. PostgreSQL is running');
    console.error('  2. Password is correct (currently set to: 123456)');
    console.error('  3. You have permission to create databases');
    process.exit(1);
  }
}

createDatabase();

