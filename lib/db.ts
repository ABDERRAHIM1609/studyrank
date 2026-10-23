import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/drizzle/schema';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

export const sqlClient = neon(connectionString);
export const db = drizzle(sqlClient, { schema });

export async function ensureDatabaseTables() {
  // Create users table
  await sqlClient(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      school VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL DEFAULT 'Morocco',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Create enum
  await sqlClient(`
    DO $$ BEGIN
      CREATE TYPE task_status AS ENUM ('todo', 'done');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create tasks table
  await sqlClient(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(500) NOT NULL,
      date VARCHAR(10) NOT NULL,
      status task_status NOT NULL DEFAULT 'todo',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMP
    );
  `);

  // Create daily_snapshots table
  await sqlClient(`
    CREATE TABLE IF NOT EXISTS daily_snapshots (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date VARCHAR(10) NOT NULL,
      total_tasks INTEGER NOT NULL DEFAULT 0,
      completed_tasks INTEGER NOT NULL DEFAULT 0,
      completion_pct REAL NOT NULL DEFAULT 0,
      school_rank INTEGER NOT NULL DEFAULT 1,
      city_rank INTEGER NOT NULL DEFAULT 1,
      national_rank INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

export type DB = typeof db;
