import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the database instance with schema
export const db = drizzle(pool, { schema });

// Export the connection pool for manual queries if needed
export { pool };

// Global declaration to prevent multiple instances in development
declare global {
  var __drizzle_db: typeof db | undefined;
}

// Use global instance in development to prevent connection pool exhaustion
const globalForDb = globalThis as unknown as {
  __drizzle_db: typeof db | undefined;
};

export const database = globalForDb.__drizzle_db ?? db;

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__drizzle_db = database;
}
