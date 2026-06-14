import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.NEON_DATABASE_URL || '';
const isValidUrl = databaseUrl.startsWith('postgres') || databaseUrl.startsWith('http');

// Create a mock SQL function if no URL is provided, so the server can still run
export const sql = isValidUrl 
  ? neon(databaseUrl) 
  : async (query: string, params?: any[]) => {
      console.warn('Mock DB Call (No valid NEON_DATABASE_URL provided):', query);
      return [];
    };

export const initializeDatabase = async () => {
  if (!isValidUrl) {
    console.warn('Skipping database initialization because NEON_DATABASE_URL is not set or invalid.');
    return;
  }

  try {
    // Create Sessions Table
    await sql(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        duration_seconds INT,
        status VARCHAR(50) DEFAULT 'completed'
      );
    `);

    // Create Thoughts Table (Brain Dump & Parked)
    await sql(`
      CREATE TABLE IF NOT EXISTS thoughts (
        id SERIAL PRIMARY KEY,
        session_id INT REFERENCES sessions(id),
        type VARCHAR(50) NOT NULL, -- 'dump' or 'parked'
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Summaries Table
    await sql(`
      CREATE TABLE IF NOT EXISTS summaries (
        id SERIAL PRIMARY KEY,
        session_id INT REFERENCES sessions(id),
        today_summary TEXT,
        tomorrow_tasks TEXT,
        let_go TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
