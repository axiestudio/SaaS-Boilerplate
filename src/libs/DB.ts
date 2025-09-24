import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite, type PgliteDatabase } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';
import './InitDB'; // This will auto-initialize the database

let client;
let drizzle;

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
  client = new Client({
    connectionString: Env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Database connected successfully!');

    drizzle = drizzlePg(client, { schema });

    console.log('🔄 Running AUTOMATIC database migration...');
    console.log('📁 Migrations folder:', path.join(process.cwd(), 'migrations'));

    await migratePg(drizzle, {
      migrationsFolder: path.join(process.cwd(), 'migrations'),
    });

    console.log('✅ AUTOMATIC database migration completed successfully!');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    // Don't throw error to prevent build failure, but log it
    console.error('⚠️  Continuing without migration - this may cause issues');
  }
} else {
  // Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
  const global = globalThis as unknown as { client: PGlite; drizzle: PgliteDatabase<typeof schema> };

  if (!global.client) {
    global.client = new PGlite();
    await global.client.waitReady;

    global.drizzle = drizzlePglite(global.client, { schema });
  }

  drizzle = global.drizzle;

  console.log('🔄 Running automatic PGlite migration...');
  await migratePglite(global.drizzle, {
    migrationsFolder: path.join(process.cwd(), 'migrations'),
  });
  console.log('✅ PGlite migration completed successfully!');
}

export const db = drizzle;
