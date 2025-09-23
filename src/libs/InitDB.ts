import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import * as schema from '@/models/Schema';
import { Env } from './Env';

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) {
    console.log('📋 Database already initialized, skipping...');
    return;
  }

  if (!Env.DATABASE_URL) {
    console.log('⚠️  No DATABASE_URL found, skipping database initialization');
    return;
  }

  try {
    console.log('🔗 Initializing database connection...');
    console.log('🔗 Database URL:', Env.DATABASE_URL.substring(0, 50) + '...');
    
    const client = new Client({
      connectionString: Env.DATABASE_URL,
    });
    
    await client.connect();
    console.log('✅ Database connected successfully!');
    
    const db = drizzle(client, { schema });
    
    console.log('🔄 Running automatic database migration...');
    const migrationsFolder = path.join(process.cwd(), 'migrations');
    console.log('📁 Migrations folder:', migrationsFolder);
    
    await migrate(db, {
      migrationsFolder,
    });
    
    console.log('✅ Database migration completed successfully!');
    
    // Test the connection by running a simple query
    console.log('🧪 Testing database connection...');
    const result = await client.query('SELECT COUNT(*) as count FROM chat_interface');
    console.log(`📊 Found ${result.rows[0].count} chat interfaces in database`);
    
    await client.end();
    console.log('🔚 Database initialization completed!');
    
    isInitialized = true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.error('Stack trace:', (error as Error).stack);
    throw error;
  }
}

// Auto-initialize when this module is imported
initializeDatabase().catch(console.error);
